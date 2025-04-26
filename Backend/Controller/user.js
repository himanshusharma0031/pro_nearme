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
    const { city, serviceType } = req.query;
  
    if (!city || !serviceType) {
      return res.status(400).json({ message: "City and Service Type are required" });
    }
  
    try {
      const allproviders = await Provider.find({
        city,
        serviceType: { 
          $regex: `^${serviceType}`, // ^ means starts with
          $options: 'i' // i means case-insensitive (S == s)
        }
      });
  
      if (allproviders.length === 0) {
        return res.status(404).json({ message: "No providers found for this city/service" });
      }
  
      res.status(200).json(allproviders);
    } catch (error) {
      res.status(500).json({ message: error.message });
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


const providerAvailability = async (date, time, providerId) => {
  try {
    const provider = await Provider.findById(providerId);
    if (!provider) return false;

    // Normalize input
    const requestedTime = time.trim();
    const requestedDate = date.trim();

    const availabilityForDate = provider.availability.find(slot => {
      return slot.date === requestedDate;
    });

    if (!availabilityForDate) {
      console.log("No availability for date:", requestedDate);
      return false;
    }

    const isAvailable = availabilityForDate.timeSlots.includes(requestedTime);

    if (!isAvailable) {
      console.log("Requested time not found in:", availabilityForDate.timeSlots);
    }

    return isAvailable;
  } catch (err) {
    console.error("Error checking provider availability:", err);
    return false;
  }
};


const providerbooking = async(req,res)=>{
    const {date,time}=req.body;

    try{
      const   isAvailable = await providerAvailability(date,time,req.params.id);
        if(!isAvailable){
            return res.status(400).json({ message: "Time slot is not available" });
        }

        const booking  =await  Booking.create({
            userId:req.user.id,
            providerId:req.params.id,
            date:date,
            time:time
        });

        if(!booking){
           return  res.status(400).json({message:"booking failed"});
        }
        res.status(200).json(booking);

        


    }
    catch(error){
        res.json(error);
    }


};



module.exports = {Signup,login,getallproviders,providerProfile,providerAvailability,providerbooking}