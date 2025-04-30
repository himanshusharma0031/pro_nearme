import React, { useState } from 'react';
import './Main.css';
import { motion } from "framer-motion";
import { Typewriter } from 'react-simple-typewriter';
import { useLocation } from 'react-router-dom';
import axios from "axios";



function Main() {
  const location = useLocation();
  const { name ,city} = location.state || {}; // safely get name
  console.log(name);
  console.log(city);
  const [serviceType,setserviceType]=useState("");
  const [searchdata,setsearchdata]=useState([]);

  console.log(serviceType);  
  

  const handlesearch = async (searchText) => {
    if (searchText.trim().length > 0) {  // Check if searchText is not just spaces
        try {
            const token = localStorage.getItem("userToken");

            if (searchText === "") {
                setserviceType("");
            }

            const response = await axios.post(
                "http://localhost:5000/allproviders", 
                { city, serviceType: searchText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data && response.data.allproviders) {
                console.log(response.data.allproviders);
                setsearchdata(response.data.allproviders);
            }
        } catch (error) {
            console.error("Error during search:", error);
            console.log(error.response?.data?.message || "Something went wrong");
        }
    } else {
        setsearchdata([]); 
    }
};


  

  
  
  return (
<div className='maindiv'>
  <div className='navbar'>
    <img src="/logo.png" alt="Logo" />
    <input
  placeholder="search professional by their profession or city"
  value={serviceType}
  onChange={(e) => {
    setserviceType(e.target.value);
    handlesearch(e.target.value); 
  }}
/>

    <div className='navcomp1'>
        <i className="fa-solid fa-location-dot"></i>
        <p>{city || "city"}</p>
    </div>
    <div className='navcomp2'>
        <i className="fa-solid fa-calendar-check"></i>
        <p>My Bookings</p>
    </div>
  </div>

  <div className="user">
    <i className="fa-solid fa-user"></i>
  </div>
  <hr />

  <div style={{ position: 'relative' }}>

  <div
    className={`searchdata ${searchdata.length === 0 ? 'hidden' : ''}`}
    style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      maxHeight: '300px',
      overflowY: 'auto'
    }}
  >
    <ul className="search-results" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {[...new Set(searchdata.map(provider => provider.serviceType))].map((serviceType, index) => (
        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
          {serviceType}
        </li>
      ))}
    </ul>
  </div>
</div>



  <div className="content-container">
    <div className="text-container">
      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold text-blue-700 mt-10 mb-4"
      >
       HI {name} Welcome to UtilityConnect
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xl text-gray-700 mb-4"
      >
        Your one-stop platform to book reliable service professionals.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-lg text-gray-600 mb-6"
      >
        <span>We help you </span>
        <span className="text-blue-500 font-semibold">
          <Typewriter
            words={['fix leaks', 'install wiring', 'repair appliances', 'get help instantly']}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </motion.div>

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delayChildren: 1.2, staggerChildren: 0.3 }
          }
        }}
        className="mb-6 text-gray-700"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {[
          '✔ Verified Professionals',
          '✔ Easy Scheduling',
          '✔ Real-Time Availability',
          '✔ Trusted by Locals'
        ].map((item, i) => (
        <motion.li
            key={i}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            style={{ marginBottom: '10px' }}
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
      >
        Book Your Service Now
      </motion.button>
    </div>

    <div className="image-container">
      <img src="logo1.jpeg" alt="Main Image" />
    </div>
  </div>
</div>

  )
}

export default Main;