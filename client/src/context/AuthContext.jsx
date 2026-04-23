// Import React hooks needed for this component
import { createContext, useContext, useState } from "react";

// Create a Context object that will store authentication data
// null is the default value if someone tries to use useAuth() outside of AuthProvider
const AuthContext = createContext(null);

// AuthProvider component - wraps your entire app to provide auth data to all components
export function AuthProvider({ children }) {
  // Initialize token state from localStorage (so token persists on page reload)
  // useState with a function runs that function once on first render (lazy initialization)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // login function: saves JWT token to localStorage AND updates React state
  // localStorage keeps it even after page refresh; state updates the UI instantly
  function login(jwt) {
    localStorage.setItem("token", jwt); // Save to browser storage (survives page reload)
    setToken(jwt); // Update React state (triggers re-render if needed)
  }

  // logout function: removes token from both localStorage and React state
  function logout() {
    localStorage.removeItem("token"); // Delete from browser storage
    setToken(null); // Clear from React state
  }

  // Wrap children components with AuthContext.Provider
  // "value" prop passes data down to all descendant components
  // Any component can now access { token, login, logout } via useAuth()
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook: convenience function to access auth context from any component
// Instead of useContext(AuthContext), you just call useAuth()
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext); // Returns { token, login, logout }
}
