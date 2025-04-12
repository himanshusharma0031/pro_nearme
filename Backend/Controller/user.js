const User = require('../Models/user');
const Provider = require('../Models/provider');

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
res.status(200).json(user);

}
else{
    res.status(200).json("invalid credentials");
}
}
catch(error){
console.log(error);

}

};

const getallproviders = async(req,res)=>{
    const {city,serviceType} = req.query;
    
    // if (!city || !serviceType) {
    //     return res.status(400).json({ message: "City and Service Type are required" });
    // }
    try{
        const allproviders = await Provider.find({city,serviceType});
        if (allproviders.length === 0) {
            return res.status(404).json({ message: "No providers found for this city/service" });
        }
        if(allproviders){
            res.status(200).json(allproviders);

        }

    }
    catch(error){
res.json(error);

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

const providerAvailability = async(req,res)=>{
    const {date,time} = req.body;
try{
    const provider  = await Provider.findById(req.params.id);
    if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

    const dayAvailability = provider.availability.find(avail => avail.date === date);

    if (!dayAvailability) {
        return res.status(404).json({ message: "No availability found for the selected date" });
      }

      const isAvailable = dayAvailability.timeSlots.includes(time);

      if (isAvailable) {
        return res.status(200).json({ available: true, message: "Time slot is available" });
      } else {
        return res.status(200).json({ available: false, message: "Time slot is not available" });
      }


    }
    catch(error){
        console.error("Error checking availability:", error);
        res.status(500).json({ message: "Server error" });
    }

}


module.exports = {Signup,login,getallproviders,providerProfile,providerAvailability}