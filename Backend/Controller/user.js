const User = require('../Models/user');
const Provider = require('../Models/provider');
const Booking = require('../Models/booking');

const bcrypt = require ('bcryptjs');
const generatetoken = require('../config/genratetoken');

const Signup = async (req,res) =>{
const {name,email,password,location,city} = req.body;
if(!email || !name || !password ){
    res.status(400).json("please enter all fields");
return ;
}

try {
    
    const alreadyexist = await User.findOne({email});
    if(alreadyexist){
        res.json("user already exist");

    }


const user = await User.create({
    name,
    email,
    password,
    location,
    city


});

res.json(
    {_id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            token:generatetoken(user._id)
}
);
}

catch (error) {
    res.json(error);
    
}

};


const login = async(req,res)=>{
const {email ,password} = req.body;

if(!email || !password){
    res.status(404).json("Please enter all fields");
}

try{
const user = await User.findOne({email});

if(user && (await bcrypt.compare(password,user.password))){
res.status(200).json(
    {
        _id:user._id,
            name:user.name,
            email:user.email,
            city:user.city,
            
        token:generatetoken(user._id)
    }
);

}
else{
    res.status(404).json("invalid credentials");
}
}
catch(error){
console.log(error);

}

};
const getallproviders = async (req, res) => {
    const { city, serviceType } = req.body;
  
    if (!city || !serviceType) {
      return res.status(400).json({ message: "City and Service Type are required" });
    }
  
    try {
      const allproviders = await Provider.find({
        city: city,
        serviceType: { $regex: serviceType, $options: 'i' }
      });
  
      if (allproviders.length === 0) {
        return res.status(404).json({ message: "No providers found for this city/service" });
      }
  
      res.status(200).json({allproviders});
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  const getprovider = async (req, res) => {
    const { city, serviceType } = req.body;
  
    if (!city || !serviceType) {
      return res.status(400).json({ message: "City and Service Type are required" });
    }
  
    try {
      const allproviders = await Provider.find({
        city: city,
        serviceType: serviceType
      });
  
      if (allproviders.length === 0) {
        return res.status(404).json({ message: "No providers found for this city/service" });
      }
  
      res.status(200).json({allproviders});
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  
  
const providerProfile = async(req,res)=>{
    try {
        const provider = await Provider.findById(req.params.id);

        if(!provider){
            res.status(400).json("No Provider Found");
            return;
        }

            res.json({
                name:provider.name,
                email:provider.email,
                location:provider.location,
                serviceType:provider.serviceType
            });


    
    } catch (error) {
        
    }

};
// helper.js
const checkAvailability = (provider, date, time) => {
  const requestedTime = time.trim();
  const requestedDate = date.trim();

  // 1. Check availability data (date + timeslot)
  const availabilityForDate = provider.availability.find(
    slot => slot.date === requestedDate
  );

  if (!availabilityForDate) return false;
  const isTimeAvailable = availabilityForDate.timeSlots.includes(requestedTime);
  if (!isTimeAvailable) return false;

  // 2. Check if there's a confirmed booking for this date + time
  const isSlotTaken = provider.bookings?.some(booking =>
    booking.date === requestedDate &&
    booking.time === requestedTime &&
    booking.status === "confirmed"
  );

  // 3. Allow booking if no confirmed booking exists
  return !isSlotTaken;
};


const providerAvailability = async (req, res) => {
  try {
    const { date, time } = req.body;
    const { id: providerId } = req.params;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const requestedTime = time.trim();
    const requestedDate = date.trim();

    const isAvailable = checkAvailability(provider, requestedDate, requestedTime);
    res.status(200).json({ available: isAvailable });

  } catch (err) {
    console.error("Error checking provider availability:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



const providerbooking = async (req, res) => {
  const { date, time } = req.body;
  const { id: providerId } = req.params;
  const userId = req.user.id;
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID' });
  }
  

  try {
      // Find provider by ID
      const provider = await Provider.findById(providerId);
      if (!provider) return res.status(404).json({ message: "Provider not found" });

      // Check availability
      const isAvailable = await checkAvailability(provider,date, time);
      if (!isAvailable) {
          return res.status(400).json({ message: "Time slot is not available" });
      }

      // Create booking

      const alreadyAccepted = await Booking.findOne({
        providerId,
        date,
        time,
        status: "Accepted"
      });

      const uniquebook = await Booking.findOne({
        providerId,
        userId,
        date,
        time,
        status:"pending"
      });
      
      if (uniquebook) {
        return res.status(400).json({ message: "You have already booked this slot." });
      }
      
      
      if (alreadyAccepted ) {
        return res.status(400).json({ message: "Another booking has already been accepted for this time." });
      }

      
      const booking = await Booking.create({
          userId: userId,
          providerId: providerId,
          date: date,
          time: time
      });

      if (!booking) {
          return res.status(400).json({ message: "Booking failed" });
      }

      // Return success response
      res.status(200).json({ message: "Booking successful", booking });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(200).json({ message: 'Duplicate booking ' });
    } else {
      // Other errors
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

const fetchbooking = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);

  try {
    const response = await Booking.find({ userId })
      .populate("providerId", "name serviceType"); // ✅ Pulls full provider info

    if (!response || response.length === 0) {
      return res.json({ message: "No bookings found" });
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};




module.exports = {Signup,login,getallproviders,providerProfile,providerAvailability,providerbooking,getprovider,fetchbooking}