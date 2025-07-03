import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProviderBookings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = "https://pro-near-me-8.onrender.com";

  const fetchProviderBookings = async () => {
    try {
      const token = localStorage.getItem("ProviderToken");
      const response = await axios.get(
        `${API}/proffesionals/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
    }
  };

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  const handlebook = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ProviderToken");
      const res = await axios.put(
        `${API}/proffesionals/bookings/update/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
console.log(res);

      if (res.data && res.status === 200 ) {
        if(res.data.status==="Confirmed"){toast.success(`Booking ${newStatus}`);}
        else{
          toast.error(`Booking ${newStatus}`)
        }
        
        await fetchProviderBookings(); 
      } else {
        toast.error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Error updating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {bookings.map((booking, index) => (
        <div className="allbookings" key={index}>
          <div className="booking-header">
            <p>Date: <span>{booking.date}</span></p>
            <p>Time: <span>{booking.time}</span></p>
          </div>

          <p className={`booking-status ${booking.status.toLowerCase()}`}>
            Status: <span>{booking.status}</span>
          </p>

          {booking.userId && (
            <div className="provider-details">
              <p><strong>Booked By:</strong> {booking.userId.name}</p>
              <p><strong>Email:</strong> {booking.userId.email}</p>
            </div>
          )}

          <div className='accrej'>
            <div className='approve' onClick={() => handlebook(booking._id, "Confirmed")}>
              <i className="fa-solid fa-check"></i>
            </div>
            <div className='reject' onClick={() => handlebook(booking._id, "Rejected")}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderBookings;
