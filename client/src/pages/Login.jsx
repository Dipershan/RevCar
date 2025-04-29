import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", { email, password });

      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed!");
    }
  };
  
  

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Side Image */}
      <div className="col-md-7 d-none d-md-block p-0">
        <img
          src="https://media.istockphoto.com/id/1167991014/photo/modern-blue-sports-car-in-a-gentle-light-on-black-background.jpg?s=612x612&w=0&k=20&c=szCbC--4de-XfIzSy9Q6vUTknUP9Are6SRRbBo74d0o=" 
          alt="Car"
          className="img-fluid h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Right Side Form */}
      <div className="col-md-5 d-flex align-items-center justify-content-center bg-dark text-light">
        <div className="p-4" style={{ width: "80%", maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100">
              Login
            </button>

            <div className="text-center mt-3">
              <a href="/register" className="text-decoration-none text-light">
                Click Here to Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
