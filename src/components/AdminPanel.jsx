import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, Layers, MessageSquare,
  Trash2, ShieldCheck, Mail, Upload, Sparkles, Plus,
  TrendingUp, Calendar, Inbox, DollarSign, MoreHorizontal,
  Edit3, X, CheckCircle2, XCircle, Eye, ClipboardList,
  Loader2, AlertTriangle
} from 'lucide-react';
import {
  createProperty, updateProperty, deleteProperty,
  fetchInquiries, updateInquiryStatus,
  fetchSubmissions, approveSubmission, rejectSubmission, uploadImage
} from '../lib/propertyService';

export default function AdminPanel({ properties, setProperties, agents, onPropertiesChange }) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tagline, setTagline] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [area, setArea] = useState('3000');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);



  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [aiDraftText, setAiDraftText] = useState('');

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load inquiries and submissions from Supabase
  useEffect(() => {
    loadInquiries();
    loadSubmissions();
  }, []);

  const loadInquiries = async () => {
    try {
      const data = await fetchInquiries();
      if (data.length > 0) {
        setInquiries(data);
      } else {
        // Fallback mock inquiries
        setInquiries([
          { id: 'mock-1', name: "Rohan Sharma", email: "rohan.s@email.com", message: "Interested in the Helix Penthouse. Can we arrange a VR walkthrough tomorrow?", status: "New", date: "2 hours ago", property: "The Helix Penthouse" },
          { id: 'mock-2', name: "Priya Kapoor", email: "p.kapoor@global.com", message: "Does Emerald Estates Villa 4 support solar grid additions?", status: "Replied", date: "Yesterday", property: "Emerald Estates Villa 4" },
          { id: 'mock-3', name: "Vikram Malhotra", email: "v.malhotra@tech.in", message: "Is the price on Skyline Towers — 4BHK negotiable?", status: "Pending", date: "Oct 22, 2024", property: "Skyline Towers — 4BHK" },
          { id: 'mock-4', name: "Ananya Iyer", email: "ananya.i@art.org", message: "Is The Marquee Residences available for immediate move in?", status: "Replied", date: "Oct 21, 2024", property: "The Marquee Residences" }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load inquiries');
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await fetchSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.warn('Failed to load submissions');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Handle image file selection
  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImage('');
    }
  };

  // Handle add / edit property
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!title || !price) return;
    setLoading(true);

    try {
      let finalImageUrl = image;

      // Upload image if file was selected
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          console.warn('Image upload failed:', uploadErr.message);
          if (!image) {
            finalImageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';
          }
        }
      }

      if (editingId) {
        // UPDATE existing property
        await updateProperty(editingId, {
          title,
          price: parseFloat(price) * 100000,
          tagline,
          image: finalImageUrl,
          details: {
            bedrooms: parseInt(bedrooms),
            bathrooms: Math.ceil(parseInt(bedrooms) * 0.9),
            area: parseInt(area),
            floors: 1,
            parking: 2
          },
        });
        showToast('Property updated successfully!');
      } else {
        // CREATE new property
        await createProperty({
          title,
          price: parseFloat(price) * 100000,
          tagline,
          image: finalImageUrl,
          details: {
            bedrooms: parseInt(bedrooms),
            bathrooms: Math.ceil(parseInt(bedrooms) * 0.9),
            area: parseInt(area),
            floors: 1,
            parking: 2
          },
        });
        showToast('Listing created successfully!');
      }

      // Refresh properties
      if (onPropertiesChange) onPropertiesChange();

      // Reset form
      resetForm();
      setActiveSubTab('overview');
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setTagline('');
    setBedrooms('3');
    setArea('3000');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  };

  // Start editing a property
  const startEdit = (prop) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setPrice(String(prop.price / 100000));
    setTagline(prop.tagline || '');
    setBedrooms(String(prop.details?.bedrooms || 3));
    setArea(String(prop.details?.area || 3000));
    setImage(prop.image || '');
    setImagePreview('');
    setImageFile(null);
    setActiveSubTab('add');
  };

  // Delete property
  const handleDelete = async (propId) => {
    setActionLoading(propId);
    try {
      await deleteProperty(propId);
      if (onPropertiesChange) onPropertiesChange();
      showToast('Property deleted successfully!');
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setActionLoading('');
      setDeleteConfirm(null);
    }
  };



  // Draft AI Response
  const draftAIResponse = (inquiry) => {
    setSelectedInquiry(inquiry);
    let draft = "";
    if (inquiry.property.includes("Helix") || inquiry.property.includes("Penthouse")) {
      draft = `Dear ${inquiry.name},\n\nRegarding the Helix Penthouse: Yes, we can coordinate a private VR showing. I have availability tomorrow at 2:00 PM. Please confirm if that slot works for you.\n\nWarm regards,\nJulian Thorne\nAetheria Brokerage Team`;
    } else if (inquiry.property.includes("Emerald")) {
      draft = `Dear ${inquiry.name},\n\nThe Emerald Estates Villa 4 features pre-installed solar connections and allows simple battery retrofits up to 40 kW.\n\nWarm regards,\nAlex Rivera\nLuxury Consultant`;
    } else {
      draft = `Dear ${inquiry.name},\n\nThank you for reaching out. Let us schedule a direct conversation node to review terms for the ${inquiry.property}.\n\nWarm regards,\nAetheria Team`;
    }
    setAiDraftText(draft);
  };

  // Handle inquiry reply
  const handleInquiryReply = async () => {
    if (!selectedInquiry) return;
    setActionLoading('reply');
    try {
      // Update status if it's a real DB inquiry
      if (!selectedInquiry.id.startsWith('mock-')) {
        await updateInquiryStatus(selectedInquiry.id, 'replied');
      }
      setInquiries(inquiries.map(item =>
        item.id === selectedInquiry.id ? { ...item, status: 'Replied' } : item
      ));
      showToast(`Reply sent to ${selectedInquiry.email}`);
      setSelectedInquiry(null);
    } catch (err) {
      showToast('Reply failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  // Approve submission
  const handleApprove = async (submission) => {
    setActionLoading(submission.id);
    try {
      await approveSubmission(submission, user?.id);
      if (onPropertiesChange) onPropertiesChange();
      loadSubmissions();
      showToast(`"${submission.title}" approved and published!`);
      setSelectedSubmission(null);
    } catch (err) {
      showToast('Approval failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  // Reject submission
  const handleReject = async (submissionId) => {
    setActionLoading(submissionId);
    try {
      await rejectSubmission(submissionId, user?.id, rejectNotes);
      loadSubmissions();
      showToast('Submission rejected');
      setSelectedSubmission(null);
      setRejectNotes('');
    } catch (err) {
      showToast('Rejection failed: ' + err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const pendingCount = submissions.filter(s => s.review_status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-surface-offwhite w-full">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-[64px] right-6 z-[60] px-5 py-3 rounded-xl shadow-lg text-[14px] font-semibold flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
        >
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" style={{ animation: 'modalSlideIn 0.3s ease-out' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-primary">Delete Property</h3>
                <p className="text-[13px] text-on-surface-variant">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[14px] text-on-surface-variant mb-6">
              Are you sure you want to permanently delete <strong className="text-primary">{deleteConfirm.title}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[14px] font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading === deleteConfirm.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar: 240px white sidebar */}
      <aside className="w-[240px] border-r border-border-subtle bg-white flex flex-col fixed inset-y-0 left-0 z-40 pt-[52px]">
        <div className="p-5 flex-1 flex flex-col gap-2 mt-4 text-left">
          <button 
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'overview' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-[14px] font-semibold">Dashboard</span>
          </button>
          
          <button 
            onClick={() => { resetForm(); setActiveSubTab('add'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'add' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <PlusCircle size={18} />
            <span className="text-[14px] font-semibold">Add Listing</span>
          </button>



          <button 
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'inquiries' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <MessageSquare size={18} />
            <span className="text-[14px] font-semibold">Inquiries</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('submissions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${activeSubTab === 'submissions' ? 'sidebar-active text-accent-blue bg-surface-offwhite' : 'text-on-surface-variant hover:bg-surface-offwhite hover:text-primary font-medium'}`}
          >
            <ClipboardList size={18} />
            <span className="text-[14px] font-semibold">Review Submissions</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-accent-blue text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-border-subtle bg-white text-left">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-indigo-600 flex items-center justify-center">
              <span className="text-white text-[13px] font-bold">
                {user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-bold text-primary truncate">{user?.email?.split('@')[0] || 'Agent'}</span>
              <span className="text-[12px] text-on-surface-variant font-medium truncate">{user?.email || 'agent@aetheria.com'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] p-gutter pt-[80px] min-h-screen text-left">
        <div className="max-w-[980px] mx-auto py-8">
          
          {/* Subtab: Overview */}
          {activeSubTab === 'overview' && (
            <div>
              {/* Header Actions */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-[32px] font-bold text-primary tracking-tight">Welcome back</h1>
                  <p className="text-on-surface-variant text-[17px] mt-1">Here is what's happening with your properties today.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveSubTab('inquiries')}
                    className="px-6 py-2.5 bg-white border border-border-strong text-primary rounded-full text-[14px] font-semibold hover:bg-surface-offwhite transition-all cursor-pointer"
                  >
                    View Inquiries
                  </button>
                  <button 
                    onClick={() => { resetForm(); setActiveSubTab('add'); }}
                    className="px-6 py-2.5 bg-accent-blue text-white rounded-full text-[14px] font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Add Listing</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Active Listings</p>
                  <p className="text-[32px] font-bold text-primary">{properties.length}</p>
                  <div className="mt-2 flex items-center gap-1 text-success text-[13px] font-semibold">
                    <TrendingUp size={14} />
                    <span>2 New this week</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">New Inquiries</p>
                  <p className="text-[32px] font-bold text-accent-blue">{inquiries.filter(i => i.status === 'New').length || 5}</p>
                  <div className="mt-2 text-on-surface-variant text-[13px] font-medium">
                    Requires immediate action
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Pending Reviews</p>
                  <p className="text-[32px] font-bold text-orange-500">{pendingCount}</p>
                  <div className="mt-2 text-on-surface-variant text-[13px] font-medium">
                    Seller submissions
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="text-on-surface-variant text-[14px] font-semibold mb-2">Revenue</p>
                  <p className="text-[32px] font-bold text-primary">Rs. 2.4Cr</p>
                  <div className="mt-2 text-success text-[13px] font-semibold">
                    Q3 Target achieved
                  </div>
                </div>
              </div>

              {/* Properties List with Edit/Delete */}
              <div className="bg-white rounded-card border border-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center">
                  <h2 className="text-[24px] font-semibold text-primary">Your Properties</h2>
                  <span className="text-[14px] text-on-surface-variant font-medium">{properties.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-offwhite border-b border-border-subtle">
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Property</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {properties.map(prop => (
                        <tr key={prop.id} className="hover:bg-surface-offwhite transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {prop.image && (
                                <img src={prop.image} alt={prop.title} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-primary">{prop.title}</span>
                                <span className="text-[12px] text-on-surface-variant">{prop.details?.bedrooms || '—'} BHK · {prop.details?.area || '—'} sqft</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[15px] font-semibold text-primary">
                            Rs. {(prop.price / 100000).toFixed(0)}L
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              prop.status === 'available' ? 'bg-green-50 text-green-600' :
                              prop.status === 'sold' ? 'bg-red-50 text-red-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>
                              {prop.status || 'available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(prop)}
                                className="p-2 text-on-surface-variant hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(prop)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: Add / Edit Property */}
          {activeSubTab === 'add' && (
            <div className="max-w-2xl bg-white border border-border-subtle rounded-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[24px] font-semibold text-primary">
                  {editingId ? 'Edit Listing' : 'Create Listing'}
                </h2>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-[13px] text-on-surface-variant hover:text-primary font-semibold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddProperty} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-on-surface-variant">Property Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Skyline Oasis Villa" 
                    className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Price (in Lakhs)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      placeholder="e.g. 75" 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Area (sqft)</label>
                    <input 
                      type="number" 
                      value={area} 
                      onChange={e => setArea(e.target.value)} 
                      placeholder="e.g. 3000" 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Bedrooms</label>
                    <select 
                      value={bedrooms} 
                      onChange={e => setBedrooms(e.target.value)} 
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                    >
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Property Photo</label>
                    <label className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[15px] flex items-center gap-2 cursor-pointer hover:bg-border-subtle transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                      <Upload size={16} className="text-accent-blue" />
                      <span className="text-on-surface-variant truncate">
                        {imageFile ? imageFile.name : 'Upload image...'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Image URL fallback */}
                {!imageFile && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-on-surface-variant">Or Image URL</label>
                    <input 
                      type="text" 
                      value={image} 
                      onChange={e => setImage(e.target.value)} 
                      placeholder="https://..."
                      className="w-full h-11 px-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" 
                    />
                  </div>
                )}

                {/* Image Preview */}
                {(imagePreview || image) && (
                  <div className="rounded-xl overflow-hidden border border-border-subtle">
                    <img src={imagePreview || image} alt="Preview" className="w-full h-40 object-cover" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-on-surface-variant">Brief Description</label>
                  <textarea 
                    value={tagline} 
                    onChange={e => setTagline(e.target.value)} 
                    placeholder="Accents & location details..." 
                    className="w-full h-24 p-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[17px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-accent-blue hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingId ? 'Update Listing' : 'Publish Listing'
                  )}
                </button>
              </form>
            </div>
          )}



          {/* Subtab: Inquiries */}
          {activeSubTab === 'inquiries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-[24px] font-semibold text-primary mb-6">Inquiries Hub</h2>
                <div className="flex flex-col gap-4">
                  {inquiries.map(inq => (
                    <div 
                      key={inq.id}
                      onClick={() => draftAIResponse(inq)}
                      className={`bg-white border rounded-card p-5 cursor-pointer transition-all text-left shadow-sm ${selectedInquiry?.id === inq.id ? 'border-accent-blue' : 'border-border-subtle hover:border-border-strong'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-primary text-[15px]">{inq.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'New' ? 'bg-[#abc7ff]/30 text-accent-blue' :
                          inq.status === 'Replied' ? 'bg-success/15 text-success' : 'bg-orange-100 text-orange-700'
                        }`}>{inq.status}</span>
                      </div>
                      <div className="text-[13px] text-on-surface-variant mb-2">
                        Property: <strong className="text-primary font-semibold">{inq.property}</strong>
                      </div>
                      <p className="text-[14px] text-on-surface-variant italic font-medium">"{inq.message}"</p>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <div className="py-12 text-center text-on-surface-variant">
                      <Inbox size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[14px] font-medium">No inquiries yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Draft AI Panel */}
              <div>
                {selectedInquiry ? (
                  <div className="bg-white border border-border-subtle rounded-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-accent-blue" /> 
                      <span>AI Suggested Reply</span>
                    </h3>
                    <textarea 
                      value={aiDraftText}
                      onChange={e => setAiDraftText(e.target.value)}
                      className="w-full h-44 p-4 bg-surface-offwhite border border-border-strong rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none mb-4 font-mono leading-relaxed"
                    />
                    <button 
                      onClick={handleInquiryReply}
                      disabled={actionLoading === 'reply'}
                      className="w-full h-11 bg-accent-blue hover:opacity-90 text-white rounded-full text-[14px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading === 'reply' ? (
                        <><Loader2 size={14} className="animate-spin" /> Sending...</>
                      ) : (
                        'Send Reply'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col justify-center items-center border border-dashed border-border-strong rounded-card p-10 text-on-surface-variant text-center bg-white">
                    <Mail size={32} className="mb-3 text-accent-blue" />
                    <p className="text-[14px] font-medium">Select an inquiry node to generate draft responses</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab: Review Submissions */}
          {activeSubTab === 'submissions' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-[28px] font-bold text-primary tracking-tight">Review Submissions</h1>
                  <p className="text-on-surface-variant text-[15px] mt-1">Seller property submissions awaiting your review.</p>
                </div>
                <button
                  onClick={loadSubmissions}
                  className="px-5 py-2 bg-white border border-border-strong text-primary rounded-full text-[13px] font-semibold hover:bg-surface-offwhite transition-all cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-border-strong">
                  <ClipboardList size={40} className="mx-auto mb-4 text-on-surface-variant opacity-30" />
                  <h3 className="text-[18px] font-bold text-primary mb-2">No submissions yet</h3>
                  <p className="text-[14px] text-on-surface-variant">When sellers submit properties via the Sell tab, they'll appear here for review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Submissions List */}
                  <div className="flex flex-col gap-4">
                    {submissions.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => { setSelectedSubmission(sub); setRejectNotes(''); }}
                        className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${
                          selectedSubmission?.id === sub.id ? 'border-accent-blue shadow-md' : 'border-border-subtle hover:border-border-strong'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-[16px] font-bold text-primary">{sub.title}</h3>
                            <p className="text-[13px] text-on-surface-variant mt-0.5">
                              by {sub.seller_name} · {sub.seller_email}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            sub.review_status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            sub.review_status === 'approved' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {sub.review_status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-[13px] text-on-surface-variant">
                          <span>Rs. {(sub.price / 100000).toFixed(0)}L</span>
                          <span>{sub.details?.bedrooms || '—'} BHK</span>
                          <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submission Detail */}
                  <div>
                    {selectedSubmission ? (
                      <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-[80px]">
                        <h3 className="text-[20px] font-bold text-primary mb-1">{selectedSubmission.title}</h3>
                        <p className="text-[14px] text-on-surface-variant mb-4">
                          Submitted by <strong>{selectedSubmission.seller_name}</strong>
                        </p>

                        {selectedSubmission.image && (
                          <img
                            src={selectedSubmission.image}
                            alt={selectedSubmission.title}
                            className="w-full h-44 object-cover rounded-xl border border-border-subtle mb-4"
                          />
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Price</p>
                            <p className="text-[16px] font-bold text-primary">Rs. {(selectedSubmission.price / 100000).toFixed(0)} Lakhs</p>
                          </div>
                          <div className="bg-surface-offwhite p-3 rounded-lg">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase">Config</p>
                            <p className="text-[16px] font-bold text-primary">{selectedSubmission.details?.bedrooms || '—'} BHK · {selectedSubmission.details?.area || '—'} sqft</p>
                          </div>
                        </div>

                        {selectedSubmission.description && (
                          <div className="bg-surface-offwhite p-3 rounded-lg mb-4">
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-1">Description</p>
                            <p className="text-[14px] text-primary">{selectedSubmission.description}</p>
                          </div>
                        )}

                        <div className="bg-surface-offwhite p-3 rounded-lg mb-6">
                          <p className="text-[11px] text-on-surface-variant font-bold uppercase mb-1">Seller Contact</p>
                          <p className="text-[14px] text-primary">{selectedSubmission.seller_email}</p>
                          {selectedSubmission.seller_phone && (
                            <p className="text-[13px] text-on-surface-variant">{selectedSubmission.seller_phone}</p>
                          )}
                        </div>

                        {selectedSubmission.review_status === 'pending' && (
                          <>
                            <div className="flex flex-col gap-2 mb-4">
                              <label className="text-[12px] font-semibold text-on-surface-variant">Reviewer Notes (optional)</label>
                              <textarea
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                placeholder="Add notes for rejection reason..."
                                rows={2}
                                className="w-full p-3 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(selectedSubmission)}
                                disabled={actionLoading === selectedSubmission.id}
                                className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {actionLoading === selectedSubmission.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Approve & Publish
                              </button>
                              <button
                                onClick={() => handleReject(selectedSubmission.id)}
                                disabled={actionLoading === selectedSubmission.id}
                                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          </>
                        )}

                        {selectedSubmission.review_status !== 'pending' && (
                          <div className={`px-4 py-3 rounded-xl text-[13px] font-medium ${
                            selectedSubmission.review_status === 'approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            This submission has been <strong>{selectedSubmission.review_status}</strong>
                            {selectedSubmission.reviewer_notes && (
                              <p className="mt-1 opacity-80">Notes: {selectedSubmission.reviewer_notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[300px] flex flex-col justify-center items-center border border-dashed border-border-strong rounded-xl p-10 text-on-surface-variant text-center bg-white">
                        <Eye size={32} className="mb-3 text-accent-blue" />
                        <p className="text-[14px] font-medium">Select a submission to review details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
