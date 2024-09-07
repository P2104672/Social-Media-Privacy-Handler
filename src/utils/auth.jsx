export function getUserId() {
  // Return the user ID from your authentication system
  // For example, if using localStorage:
  return localStorage.getItem('userId');
}

export function getUserAccessToken() {
  // Return the user access token from your authentication system
  // For example, if using localStorage:
  return localStorage.getItem('userAccessToken');
}
