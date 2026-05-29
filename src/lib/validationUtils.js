// Validation utilities for Nepal Real Estate Demand Form

const DISPOSABLE_EMAIL_DOMAINS = [
  'yopmail.com', 'mailinator.com', 'tempmail.com', 'temp-mail.org', 
  '10minutemail.com', 'throwawaymail.com', 'guerrillamail.com', 
  'sharklasers.com', 'getairmail.com', 'dispostable.com', 'boun.cr', 
  'mailcatch.com', 'maildrop.cc', 'mailinator.net', 'mailinator2.com', 
  'smailpro.com', 'tempmailaddress.com', 'fakeinbox.com', 'generator.email', 
  'discard.email', 'burnemail.com', 'guerrillamailblock.com', 
  'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 
  'grr.la', 'pokemail.net', 'spamgourmet.com', 'trashmail.com'
];

/**
 * Validates Nepal phone numbers.
 * Must start with +977 or 9, and be 10 digits starting with 97 or 98.
 */
export function validatePhone(phone) {
  if (!phone) return 'Phone number is required.';
  
  // Clean up spaces, dashes, parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Regex to check for Nepal mobile format
  // Optional +977 or 977, followed by 97 or 98 and 8 digits
  const nepalMobileRegex = /^(?:\+?977)?(9[78]\d{8})$/;
  
  const match = cleanPhone.match(nepalMobileRegex);
  if (!match) {
    return 'Invalid Nepal mobile number. Must be 10 digits starting with 97 or 98 (e.g., 98XXXXXXXX).';
  }
  
  return null; // Valid
}

/**
 * Validates email format and checks against disposable email providers.
 */
export function validateEmail(email) {
  if (!email) return 'Email address is required.';
  
  const trimmed = email.trim();
  
  // Basic email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  
  // Check disposable email
  const domain = trimmed.split('@')[1]?.toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return 'Temporary/disposable email addresses are not allowed.';
  }
  
  return null; // Valid
}

/**
 * Validates buyer name.
 * Must be at least 3 characters and contain at least 2 words (e.g. First Last).
 */
export function validateName(name) {
  if (!name) return 'Full name is required.';
  
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return 'Name must be at least 3 characters long.';
  }
  
  // Check if name contains only letters, spaces, and dots
  const nameRegex = /^[a-zA-Z\s.]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'Name can only contain alphabets, spaces, and dots.';
  }
  
  // Check for at least two words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return 'Please enter both your first and last name.';
  }
  
  return null; // Valid
}

/**
 * Validates description (Additional Requirements) for gibberish and quality.
 */
export function validateDescription(text) {
  if (!text) return null; // Description is optional in the state but if provided, validate it
  
  const trimmed = text.trim();
  if (trimmed.length === 0) return null;
  
  if (trimmed.length < 20) {
    return 'Please provide a more descriptive requirement (minimum 20 characters).';
  }
  
  // 1. Check for character repetition (e.g., "aaaaa", "11111", ".....")
  const repeatRegex = /(.)\1{4,}/;
  if (repeatRegex.test(trimmed)) {
    return 'Please avoid repetitive characters (e.g., "aaaaa").';
  }
  
  // 2. Check for keyboard mashing patterns
  const mashRegex = /asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|yuio|uiop|zxcv|xcvb|cvbn|vbnm/i;
  if (mashRegex.test(trimmed)) {
    return 'Gibberish or keyboard mashing detected. Please write a meaningful requirement.';
  }
  
  // 3. Check word count and word quality
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3) {
    return 'Please write at least 3 words to describe your demand.';
  }
  
  // 4. Check for very long words without vowels (classic gibberish)
  for (const word of words) {
    if (word.length > 7) {
      // If it contains no vowels and is purely alphabetic, it's likely gibberish
      const hasVowels = /[aeiouy]/i.test(word);
      const isAlphabetic = /^[a-zA-Z]+$/.test(word);
      if (isAlphabetic && !hasVowels) {
        return 'Please avoid entering gibberish words.';
      }
    }
  }
  
  return null; // Valid
}

/**
 * Validates preferred location.
 */
export function validateLocation(location) {
  if (!location) return 'Preferred location is required.';
  
  const trimmed = location.trim();
  if (trimmed.length < 3) {
    return 'Location must be at least 3 characters long.';
  }
  
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Location must contain letters (e.g., "Baluwatar, Kathmandu").';
  }
  
  return null; // Valid
}

/**
 * Checks client-side rate limiting.
 * Limit: 3 submissions per hour.
 */
export function checkRateLimit() {
  try {
    const dataStr = localStorage.getItem('demand_submissions');
    if (!dataStr) return { limited: false };
    
    const timestamps = JSON.parse(dataStr);
    const now = Date.now();
    const oneHour = 3600 * 1000;
    
    // Filter timestamps from the last 1 hour
    const activeTimestamps = timestamps.filter(t => now - t < oneHour);
    
    // Update local storage with clean list
    localStorage.setItem('demand_submissions', JSON.stringify(activeTimestamps));
    
    if (activeTimestamps.length >= 3) {
      // Find oldest active timestamp to calculate remaining time
      const oldest = activeTimestamps[0];
      const remainingMs = (oldest + oneHour) - now;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return { limited: true, retryAfterMinutes: remainingMinutes };
    }
    
    return { limited: false };
  } catch (e) {
    console.error('Rate limit check failed, bypassing:', e);
    return { limited: false };
  }
}

/**
 * Records a successful submission timestamp.
 */
export function recordSubmission() {
  try {
    const dataStr = localStorage.getItem('demand_submissions') || '[]';
    const timestamps = JSON.parse(dataStr);
    
    timestamps.push(Date.now());
    
    // Keep only timestamps from the last 1 hour
    const now = Date.now();
    const oneHour = 3600 * 1000;
    const activeTimestamps = timestamps.filter(t => now - t < oneHour);
    
    localStorage.setItem('demand_submissions', JSON.stringify(activeTimestamps));
  } catch (e) {
    console.error('Failed to record submission timestamp:', e);
  }
}
