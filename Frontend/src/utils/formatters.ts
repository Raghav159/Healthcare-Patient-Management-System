// Format a phone number to (XXX) XXX-XXXX format
export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if the input is of correct length
    if (cleaned.length !== 10) {
      return phoneNumber;
    }
    
    // Format the phone number
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };
  
  // Format currency amounts
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Truncate long text with ellipsis
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };
  
  // Capitalize the first letter of a string
  export const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Format appointment status with appropriate styling
  export const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'badge badge-info';
      case 'completed':
        return 'badge badge-success';
      case 'cancelled':
        return 'badge badge-error';
      case 'no-show':
        return 'badge badge-warning';
      default:
        return 'badge';
    }
  };