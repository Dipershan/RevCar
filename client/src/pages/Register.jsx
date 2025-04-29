import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/signup", form);
      console.log("Success:", res.data);
      navigate("/login"); // Redirect after successful registration
    } catch (err) {
      console.error("Register Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Side Image */}
      <div className="col-md-7 d-none d-md-block p-0">
        <img
          src="https://images.unsplash.com/photo-1617137968427-8590bc2675f2"
          alt="Car"
          className="img-fluid h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Right Side Form */}
      <div className="col-md-5 d-flex align-items-center justify-content-center bg-dark text-light">
        <div className="p-4" style={{ width: "80%", maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter Username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100">
              Register
            </button>

            <div className="text-center mt-3">
              <a href="/login" className="text-decoration-none text-light">
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
