import { REFRESH_KEY_TOKEN, ACCESS_KEY_TOKEN } from "../constants";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiConn from "../api";

// PrivateRoute: Protects routes from unauthorized access (login required)
function PrivateRoute({ children }) {
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    verifyAuth().catch(() => setHasAccess(false));
  }, []);

  // Attempt to refresh access token using saved refresh token
  const renewAccessToken = async () => {
    const refresh = localStorage.getItem(REFRESH_KEY_TOKEN);

    if (!refresh) {
      setHasAccess(false);
      return;
    }

    try {
      const response = await apiConn.post("/api/token/refresh/", { refresh });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_KEY_TOKEN, response.data.access);
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      setHasAccess(false);
    }
  };

  // Check if access token is valid or needs refreshing
  const verifyAuth = async () => {
    const token = localStorage.getItem(ACCESS_KEY_TOKEN);
    if (!token) {
      setHasAccess(false);
      return;
    }

    const { exp: expiry } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (expiry < currentTime) {
      await renewAccessToken(); // Token expired, try refresh
    } else {
      setHasAccess(true); // Token still valid
    }
  };

  if (hasAccess === null) return <div>Checking access...</div>;

  return hasAccess ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
