import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage & cookies
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Set flag for logout success
    localStorage.setItem("logoutSuccess", "true");

    // Redirect to login
    window.location.href = "/login";
  }, [navigate]);

  return null; // No UI needed, just handling logout
};

export default Logout;
