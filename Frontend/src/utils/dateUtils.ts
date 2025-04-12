import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

// Format a date string to a readable format (e.g., "Apr 13, 2025")
export const formatDate = (dateString: string, p0: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format a datetime string to a readable format (e.g., "Apr 13, 2025, 2:30 PM")
export const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = parseISO(dateTimeString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy, h:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid date';
  }
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (dateTimeString: string): string => {
  try {
    const date = parseISO(dateTimeString);
    if (!isValid(date)) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Invalid date';
  }
};

// Format a date for API requests (ISO format: YYYY-MM-DD)
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format a datetime for API requests (ISO format: YYYY-MM-DDTHH:mm:ssZ)
export const formatDateTimeForApi = (date: Date): string => {
  return date.toISOString();
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return date < new Date();
  } catch (error) {
    console.error('Error checking if date is in the past:', error);
    return false;
  }
};

// Calculate age from date of birth
export const calculateAge = (dobString: string): number => {
  try {
    const dob = parseISO(dobString);
    if (!isValid(dob)) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};