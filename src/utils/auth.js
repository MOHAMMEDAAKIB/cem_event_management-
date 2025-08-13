// Admin credentials storage (frontend only)
// In a real application, this should be handled securely on the backend
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Function to validate admin login
export const validateAdminLogin = (username, password) => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

// Function to check if user is authenticated (using localStorage)
export const isAuthenticated = () => {
  return localStorage.getItem('isAdminAuthenticated') === 'true';
};

// Function to set authentication status
export const setAuthenticated = (status) => {
  localStorage.setItem('isAdminAuthenticated', status.toString());
};

// Function to logout
export const logout = () => {
  localStorage.removeItem('isAdminAuthenticated');
};
