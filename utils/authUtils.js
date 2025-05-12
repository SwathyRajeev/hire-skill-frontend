export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    // Check if token exists in localStorage
    return !!localStorage.getItem("accessToken");
  }
  return false; // Default to not authenticated on the server side
};

export const getRole = () => {
  if (typeof window !== "undefined") {
    // Retrieve the user's role from localStorage
    return localStorage.getItem("role") || "user";
  }
  return null; // Default to null on the server side
};


export const logout = (redirectCallback) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  if (redirectCallback) {
    redirectCallback(); // Redirect to the sign-in page
  }
};


