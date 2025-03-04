import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    phone: "", // Add phone field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.username) {
        navigate("/dashboard");
      } else {
        setIsFormVisible(true);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "https://bank-db.onrender.com/login" : "https://bank-db.onrender.com/register";
    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : formData;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Set timeout to 10 seconds

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(result));
        navigate("/dashboard");
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {isFormVisible && (
        <div className="auth-form">
          <h2>Welcome to Modern Bank</h2>
          <div className="auth-tabs">
            <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      )}

      <div className="auth-info">
        <h1>Modern Banking for Everyone</h1>
        <p>
          Experience seamless banking with our modern platform. Send money, track transactions, and manage your finances all in one place.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
