import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Getproviders.css';  

const Getproviders = () => {
  const location = useLocation();
  const { city, serviceType } = location.state || {};
  const [providers, setProviders] = useState([]);
  const [show,setshow] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [date,setdate] = useState("");
  const [time,settime] = useState("");
  const [avail,setavail] = useState(false);
  const[bookingstatus,setbookingstatus]= useState("");
  console.log(date,time);
  console.log(avail);
  
  




  const booking = (provider)=>{
    setshow(!show);
    setSelectedProvider(provider);

  }
  const checkavail = async()=>{

    try{
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
    `http://localhost:5000/provider/${selectedProvider._id}/availability`,
        { date,time },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
    console.log(response);
    setavail(response.data.available);
    


    }
    catch(error){

    }
  }
useEffect(()=>{
checkavail();
},[date, time,selectedProvider]);

const addbooking = async()=>{
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.post(
        `http://localhost:5000/provider/${selectedProvider._id}/booking`,
      { date, time },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log(response.data.message);
    
    if(response.data.message=="Booking successful"){
setbookingstatus(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
  }
  setshow(false);
  alert(bookingstatus);

}

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
            <div className="provider-card" key={index} onClick={()=> booking(provider)}>
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

      {show && selectedProvider && (
  <div className="modal-overlay" onClick={()=> setshow(false)}>
    <div className="modal"  onClick={(e) => e.stopPropagation()}>
      <h2>{selectedProvider.name}</h2>
      <p><strong>Email:</strong> {selectedProvider.email}</p>
      <p><strong>Profession:</strong> {selectedProvider.serviceType}</p>
      <p><strong>City:</strong> {selectedProvider.city}</p>

      <div className="modal-buttons">
        <button className="check-btn" onClick={checkavail}>Check Availability</button>
        <input type='date' onChange={(e) => setdate(e.target.value)} />
<input type='time' onChange={(e) => settime(e.target.value)} />
{
  avail ? (
    <h3>Provider is available at this date and time</h3>
  ):(
    <h3>Provider is not available at this date and time</h3>
  )
}
      
        <button className="book-btn" onClick={addbooking}>Add Booking</button>
        <button className="close-btn" onClick={() => setshow(false)}>Close</button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default Getproviders;
