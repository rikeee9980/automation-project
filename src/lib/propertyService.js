import { supabase } from './supabaseClient';
import { mockProperties, mockAgents } from '../data/mockProperties';

// ============================================================
// PROPERTIES
// ============================================================

/**
 * Fetch all properties (public read).
 * Falls back to mockProperties if Supabase is not configured.
 */
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase fetch failed, using mock data:', error.message);
    return mockProperties;
  }

  // Transform Supabase snake_case to camelCase for frontend compatibility
  return data.length > 0
    ? data.map(transformProperty)
    : mockProperties;
}

/**
 * Create a new property (requires auth).
 */
export async function createProperty(propertyData) {
  const slug = propertyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

  const { data, error } = await supabase
    .from('properties')
    .insert({
      title: propertyData.title,
      slug,
      price: propertyData.price,
      location: propertyData.location || { address: 'New Link Road', city: 'Mumbai', state: 'MH', zip: '400053' },
      details: propertyData.details || { bedrooms: 3, bathrooms: 3, area: 3000, floors: 1, parking: 2 },
      amenities: propertyData.amenities || ['Smart Core Integration'],
      image: propertyData.image || '',
      before_image: propertyData.beforeImage || '',
      after_image: propertyData.afterImage || '',
      tagline: propertyData.tagline || '',
      ai_score: Math.floor(Math.random() * 10) + 85,
      ai_price_prediction: {
        sixMonth: Math.round(propertyData.price * 1.02),
        oneYear: Math.round(propertyData.price * 1.06),
        threeYear: Math.round(propertyData.price * 1.15),
      },
      status: 'available',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformProperty(data);
}

/**
 * Update a property by ID (requires auth).
 */
export async function updateProperty(id, updates) {
  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.tagline !== undefined) payload.tagline = updates.tagline;
  if (updates.image !== undefined) payload.image = updates.image;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.details !== undefined) payload.details = updates.details;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.amenities !== undefined) payload.amenities = updates.amenities;
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('properties')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformProperty(data);
}

/**
 * Delete a property by ID (requires auth).
 */
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

// ============================================================
// INQUIRIES
// ============================================================

/**
 * Fetch all inquiries (requires auth).
 */
export async function fetchInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch inquiries:', error.message);
    return [];
  }
  return data.map(transformInquiry);
}

/**
 * Create a new inquiry (public).
 */
export async function createInquiry(inquiryData) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name: inquiryData.name,
      email: inquiryData.email,
      message: inquiryData.message,
      property_id: inquiryData.propertyId || null,
      property_title: inquiryData.propertyTitle || '',
      status: 'new',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformInquiry(data);
}

/**
 * Update inquiry status (requires auth).
 */
export async function updateInquiryStatus(id, status) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformInquiry(data);
}

// ============================================================
// SUBMISSIONS (Seller property submissions)
// ============================================================

/**
 * Create a new seller submission (public).
 */
export async function createSubmission(submissionData) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      seller_name: submissionData.sellerName,
      seller_email: submissionData.sellerEmail,
      seller_phone: submissionData.sellerPhone || '',
      title: submissionData.title,
      price: submissionData.price,
      location: submissionData.location || {},
      details: submissionData.details || {},
      amenities: submissionData.amenities || [],
      image: submissionData.image || '',
      description: submissionData.description || '',
      review_status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetch all submissions (requires auth).
 */
export async function fetchSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch submissions:', error.message);
    return [];
  }
  return data;
}

/**
 * Approve a submission — creates a property and marks submission as approved.
 */
export async function approveSubmission(submission, reviewerId) {
  // 1. Create a property from the submission
  const slug = submission.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

  const { error: propError } = await supabase
    .from('properties')
    .insert({
      title: submission.title,
      slug,
      price: submission.price,
      location: submission.location || {},
      details: submission.details || {},
      amenities: submission.amenities || [],
      image: submission.image || '',
      tagline: submission.description || '',
      ai_score: Math.floor(Math.random() * 10) + 85,
      ai_price_prediction: {
        sixMonth: Math.round(submission.price * 1.02),
        oneYear: Math.round(submission.price * 1.06),
        threeYear: Math.round(submission.price * 1.15),
      },
      status: 'available',
      agent_id: reviewerId,
    });

  if (propError) throw new Error(propError.message);

  // 2. Mark submission as approved
  const { error: subError } = await supabase
    .from('submissions')
    .update({
      review_status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submission.id);

  if (subError) throw new Error(subError.message);
  return true;
}

/**
 * Reject a submission with optional notes.
 */
export async function rejectSubmission(submissionId, reviewerId, notes = '') {
  const { error } = await supabase
    .from('submissions')
    .update({
      review_status: 'rejected',
      reviewer_notes: notes,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (error) throw new Error(error.message);
  return true;
}

// ============================================================
// IMAGE UPLOAD (Supabase Storage)
// ============================================================

/**
 * Upload an image file to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// ============================================================
// HELPERS
// ============================================================

/** Transform Supabase snake_case property row to camelCase for frontend. */
function transformProperty(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    price: row.price,
    priceHistory: [
      { month: 'Mar', price: Math.round(row.price * 0.98) },
      { month: 'Apr', price: Math.round(row.price * 0.99) },
      { month: 'May', price: row.price },
    ],
    location: row.location || {},
    details: row.details || {},
    amenities: row.amenities || [],
    image: row.image || '',
    beforeImage: row.before_image || '',
    afterImage: row.after_image || '',
    virtualTourUrl: '#',
    aiScore: row.ai_score || 90,
    aiPricePrediction: row.ai_price_prediction || {},
    status: row.status || 'available',
    agentId: row.agent_id,
    createdAt: row.created_at,
    tagline: row.tagline || '',
  };
}

/** Transform Supabase inquiry row. */
function transformInquiry(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    propertyId: row.property_id,
    property: row.property_title || '',
    status: row.status === 'new' ? 'New' : row.status === 'replied' ? 'Replied' : 'Pending',
    date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}
