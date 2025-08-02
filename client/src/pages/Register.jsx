import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosInstance";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("/api/users/signup", form);
      console.log("Success:", res.data);
      alert("Registration successful! Please login with your new account.");
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Create Account</h2>
              <p className="login-subtitle">Join RevCar and start your journey</p>
            </div>
            
            {error && (
              <div className="alert alert-danger" role="alert" style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: '12px',
                color: '#dc3545',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
                style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </>
                )}
              </button>
            </form>
            
            <div className="login-footer">
              <div className="register-link">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 p-3" style={{
              background: 'rgba(30, 60, 114, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(30, 60, 114, 0.1)'
            }}>
              <div className="d-flex align-items-start">
                <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
                <div>
                  <small className="text-muted">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
