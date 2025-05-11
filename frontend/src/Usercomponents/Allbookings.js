import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Allbooking.css';


const Allbookings = () => {
    const[data,setdata]= useState([]);

    const Bookings = async()=>{
        try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "http://localhost:5000/fetchbookings",
           {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setdata(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    useEffect(()=>{
        Bookings();
    },[]);

    

  return (
    <div>
   {data.map((booking, indx) => (
  <div className="allbookings" key={indx}>
    <div className="booking-header">
      <p>Date: <span>{booking.date}</span></p>
      <p>Time: <span>{booking.time}</span></p>
    </div>

    <p className={`booking-status ${booking.status.toLowerCase()}`}>
      Status: <span>{booking.status}</span>
    </p>

    {booking.providerId && (
      <div className="provider-details">
        <p><strong>Provider:</strong> {booking.providerId.name}</p>
        <p><strong>Service:</strong> {booking.providerId.serviceType}</p>
      </div>
    )}
  </div>
))}

    </div>
  )
}

export default Allbookings