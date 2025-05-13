import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Allbooking.css'; // Reuse same CSS for styling

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchProviderBookings = async () => {
    try {
      const token = localStorage.getItem("ProviderToken"); // Assuming separate token for providers
      const response = await axios.get(
        "http://localhost:5000/proffesionals/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
    }
  };

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  return (
    <div>
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
        </div>
      ))}
    </div>
  );
};

export default ProviderBookings;
