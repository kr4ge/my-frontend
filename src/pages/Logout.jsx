import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import apiConn from "../api"; // ✅ updated import alias

function UserLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
          await apiConn.post("/api/token/blacklist/", { refresh: refreshToken });
        }

        localStorage.clear();
        window.location.reload(); // Optional: clear persisted state
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  return null;
}

export default UserLogout;
