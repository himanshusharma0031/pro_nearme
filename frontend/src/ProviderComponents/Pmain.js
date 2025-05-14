import React from 'react';
import './Pmain.css';
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';

function Pmain() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, city, serviceType } = location.state || {};
console.log(name,city);


  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate('/provider/login');
  };

  return (
    <div className="provider-main">
      <div className="navbar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="nav-items">
          <div className="nav-comp">
            <i className="fa-solid fa-briefcase"></i>
            <p>{serviceType || "Service"}</p>
          </div>
          <div className="nav-comp">
            <i className="fa-solid fa-location-dot"></i>
            <p>{city || "City"}</p>
          </div>
          <div className="nav-comp clickable" onClick={() => navigate('/provider/yourBookings')}>
            <i className="fa-solid fa-calendar-check"></i>
            <p >My Bookings</p>
          </div>
          <div className="nav-comp clickable" onClick={() => navigate('/provider/availability')}>
            <i className="fa-solid fa-clock"></i>
            <p>My Availability</p>
          </div>
          <div className="nav-comp clickable" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <p>Logout</p>
          </div>
        </div>
      </div>

      <div className="provider-content">
        <div className="text-content">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="heading"
          >
            Welcome, {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="subheading"
          >
            You're now live on UtilityConnect as a trusted <strong>{serviceType}</strong> in <strong>{city}</strong>.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delayChildren: 1, staggerChildren: 0.3 }
              }
            }}
            className="features"
          >
            {[
              '✔ Manage Your Bookings',
              '✔ Set Daily Availability',
              '✔ Connect with Users',
              '✔ Track Your Work History'
            ].map((item, index) => (
              <motion.li key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
            onClick={() => navigate('/provider/availability')}
          >
            Set Your Availability
          </motion.button>
        </div>

        <div className="image-section">
          <img src="/logo1.jpeg" alt="UtilityConnect Provider" />
        </div>
      </div>
    </div>
  );
}

export default Pmain;
