/**
 * Helper function to format authentication errors for user display
 */
export function getPasswordError(error: any): string {
  const message = error?.message || '';
  
  // Handle leaked/compromised password errors
  if (
    message.toLowerCase().includes('breach') ||
    message.toLowerCase().includes('compromised') ||
    message.toLowerCase().includes('leaked') ||
    message.toLowerCase().includes('pwned')
  ) {
    return "This password was found in a data breach. Please choose a different, stronger password that hasn't been exposed.";
  }
  
  // Handle weak password errors
  if (
    message.toLowerCase().includes('weak') ||
    message.toLowerCase().includes('strength') ||
    message.toLowerCase().includes('minimum')
  ) {
    return "Password is too weak. Please use a stronger password with at least 12 characters, including uppercase, lowercase, numbers, and symbols.";
  }
  
  // Handle password length errors
  if (message.toLowerCase().includes('length') || message.toLowerCase().includes('short')) {
    return "Password is too short. Please use at least 12 characters.";
  }
  
  // Return original message if no specific handling needed
  return message;
}

/**
 * Helper function to format general auth errors
 */
export function getAuthError(error: any): string {
  const message = error?.message || '';
  const status = error?.status || error?.code;
  
  // Handle email address invalid error
  if (error?.code === 'email_address_invalid' || message.includes('email address') && message.includes('invalid')) {
    return "This email address is not allowed. Please use a different email address. Some email providers or test domains may be blocked.";
  }
  
  // Handle 400 Bad Request errors
  if (status === 400 || status === '400') {
    // Show the actual error message for 400 errors
    if (message) {
      // Check for common 400 error messages
      if (message.includes('Password')) {
        return getPasswordError(error);
      }
      if (message.includes('email') || message.includes('Email')) {
        // Check for specific email error codes
        if (error?.code === 'email_address_invalid') {
          return "This email address is not allowed. Please try a different email address.";
        }
        return `Email error: ${message}`;
      }
      if (message.includes('User') || message.includes('user')) {
        return `User error: ${message}`;
      }
      // Return the actual message for 400 errors
      return message;
    }
    return "Invalid request. Please check your input and try again.";
  }
  
  // Handle email already registered
  if (message.includes('already registered') || message.includes('already exists') || message.includes('User already registered')) {
    return "An account with this email already exists. Please sign in instead.";
  }
  
  // Handle invalid credentials
  if (message.includes('Invalid login') || message.includes('invalid credentials')) {
    return "Invalid email or password. Please check your credentials and try again.";
  }
  
  // Handle email not confirmed
  if (message.includes('email not confirmed') || message.includes('not verified')) {
    return "Please verify your email address before signing in. Check your inbox for the verification link.";
  }
  
  // Use password error handler for password-related errors
  if (message.toLowerCase().includes('password')) {
    return getPasswordError(error);
  }
  
  // Return the error message, or a generic one if none exists
  return message || "An error occurred. Please try again.";
}

