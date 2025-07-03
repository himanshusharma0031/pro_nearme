import React, { useState } from "react";
import axios from "axios";
import './ProviderSignup.css'; // reuse the same CSS
import { useNavigate } from 'react-router-dom';

function ProviderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = "https://pro-near-me-8.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${API}/proffesionals/login`,
        { email, password },
        { withCredentials: true }
      );
      
              localStorage.setItem("ProviderToken", result.data.token);
              localStorage.setItem("LoggedInProvider", result.data._id); //it is provider id
              console.log("Token Saved:", localStorage.getItem("ProviderToken"));
      console.log(result.data);
      navigate("/provider/main",{ state: { name: result.data.name ,city: result.data.city} }); // adjust route as needed
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Provider Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default ProviderLogin;
