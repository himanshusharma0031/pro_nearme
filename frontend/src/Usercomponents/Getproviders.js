import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Getproviders.css'; // create and link this CSS file

const Getproviders = () => {
  const location = useLocation();
  const { city, serviceType } = location.state || {};
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const handlefunction = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.post(
          "http://localhost:5000/providersnearyou",
          { city, serviceType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setProviders(response.data.allproviders); 
        console.log(response.data.allproviders);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    handlefunction();
  }, [city, serviceType]);

  return (
    <div className="gpmain">
      
      <h2 className="heading">Service Providers in {city} for {serviceType}</h2>
      <div className="provider-list">
        {providers.length > 0 ? (
          providers.map((provider, index) => (
            <div className="provider-card" key={index}>
              <h3>{provider.name}</h3>
              <p><strong>Profession:</strong> {provider.serviceType}</p>
              <p><strong>Email:</strong> {provider.email}</p>
              <p><strong>Location:</strong> {provider.city}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No providers found.</p>
        )}
      </div>
    </div>
  );
};

export default Getproviders;
