import './ProviderSignup.css';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function ProviderSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(""); // manual full address
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/proffesionals/signup",
        { name, email, password, location, city, serviceType },
        { withCredentials: true }
      );

      console.log(res.data);
      alert("Signup successful!");
      navigate("/provider/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Provider Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceType">Service Type</label>
          <input
            type="text"
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="Enter your profession"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Full Address</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your full address"
            required
          />
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => navigate("/provider/login")}>
          Login
        </button>
      </form>
    </div>
  );
}

export default ProviderSignup;
