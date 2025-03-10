import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";  // Import Toastify
import { scheduleRefreshToken } from "../../Services/AxiosConfig";

export default function LoginPage({ setAuthorized }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function validateForm() {
    let valid = true;
    let newErrors = { username: "", password: "" };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Please enter username";
      valid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      valid = false;
    }

    // Password validation (4 characters minimum, no special character required)
    if (!password.trim()) {
      newErrors.password = "Please enter password";
      valid = false;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setLoginError("");
  
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
  
      const response = await axios.post(
        `${process.env.REACT_APP_ECR_BASE_URL}/api/auth/generateAuthToken`, 
        formData.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      if (response.data?.access_token) {
        const { access_token, refresh_token } = response.data;
        Cookies.set("jwt_token", access_token);
        if (refresh_token) {
          Cookies.set("refresh_token", refresh_token);
        }

        await scheduleRefreshToken(access_token);
        setAuthorized(true);
        toast.success("Login successful!", {
          pauseOnHover: false,
          hideProgressBar: false,
          theme: "colored",
          autoClose: 5000,
          position: "bottom-right",
        });
  
        setTimeout(() => {
          setIsLoading(false);
          navigate("/home");
        }, 2000);
      } else {
        handleLoginError();
      }
    } catch (error) {
      console.error("Error:", error.message);
      handleLoginError();
    }
  }
  
  const handleLoginError = () => {
    setLoginError("Invalid username or password");
    setIsLoading(false);
    toast.error("Invalid username or password", {
      hideProgressBar: false,
      theme: "colored",
      pauseOnHover: false,
      autoClose: 5000,
      position: "bottom-right",
    });
  };
  
  function handleUsernameChange(e) {
    const value = e.target.value;
    setUsername(value);
    setLoginError(""); 

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, username: "Please enter username" }));
    } else if (value.length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassword(value);
    setLoginError(""); 

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, password: "Please enter password" }));
    } else if (value.length < 4) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 4 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }

  useEffect(() => {
    setIsFormValid(username.length >= 3 && password.length >= 4);
  }, [username, password]);

  useEffect(() => {
    if (localStorage.getItem("logoutSuccess")) {
      toast.success("Logout Successfully", {
        theme: "colored",
        pauseOnHover: false,
        position: "bottom-right",
      });
      localStorage.removeItem("logoutSuccess");
    }
  
    if (localStorage.getItem("sessionExpired")) {
      toast.error("Session expired. Please log in again.", {
        theme: "colored",
        pauseOnHover: false,
        position: "bottom-right",
      });
      localStorage.removeItem("sessionExpired");
    }
  }, []);

  return (
    <div className="m-auto w-50">
      {/* Full-Page Loader */}
      {isLoading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Login
      </h2>
      
      <form onSubmit={handleLogin} noValidate>
        {/* Login Error Message */}
      {loginError && (
          <div className="text-danger text-center mt-5">{loginError}</div>
        )}
        {/* Username Input */}
        <div className="mb-4 mt-5">
          <label className="block text-gray-700 font-medium">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className={`form-control ${
              errors.username ? "is-invalid" : ""
            } mt-2`}
            value={username}
            name="username"
            onChange={handleUsernameChange}
          />
          {errors.username && (
            <div className="invalid-feedback" style={{ position: "absolute" }}>
              {errors.username}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4" style={{ position: "relative" }}>
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`form-control ${
              errors.password ? "is-invalid" : ""
            } mt-2`}
            value={password}
            name="password"
            onChange={handlePasswordChange}
          />
          <span
            style={{
              position: "absolute",
              cursor: "pointer",
              right: "30px",
              top: "38px",
            }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
          {errors.password && (
            <div className="invalid-feedback" style={{ position: "absolute" }}>
              {errors.password}
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div className="m-auto w-50">
          <Button
            type="submit"
            className={`w-100 py-2 rounded ${
              isFormValid ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
            }`}
            style={{
              opacity: !isFormValid || isLoading ? 0.3 : 1
            }}
            disabled={!isFormValid || isLoading}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
