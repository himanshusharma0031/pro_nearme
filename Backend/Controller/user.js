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
  

  const availabilityForDate = provider.availability.find(
    slot => slot.date === requestedDate
  );

  if (!availabilityForDate) return false;

  return availabilityForDate.timeSlots.includes(requestedTime);
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
      const booking = await Booking.create({
          userId: req.user.id,
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
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




module.exports = {Signup,login,getallproviders,providerProfile,providerAvailability,providerbooking,getprovider}