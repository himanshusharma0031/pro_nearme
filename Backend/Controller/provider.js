const Provider = require('../Models/provider');
const bcrypt = require ('bcryptjs');
const generatetoken = require('../config/genratetoken');
const Booking = require('../Models/booking');

const Signup = async (req,res) =>{
const {name,email,password,location,city,serviceType} = req.body;
if(!email || !name || !password || !location || !city||!serviceType){
    res.status(400).json("please enter all fields");
return ;
}

try {
    
    const alreadyexist = await Provider.findOne({email});
    if(alreadyexist){
        res.json("provider already exist");

    }


const user = await Provider.create({
    name,
    email,
    password,
    location,
    city,
    serviceType


});

res.json(
    {_id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            location:user.location,
            serviceType:user.serviceType,
            city:user.city,
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
const user = await Provider.findOne({email});
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

const booking = async(req,res)=>{
    const {status }=req.body;
    try{
    const booking = await Booking.find({providerId:req.user.id});
    if(!booking){
    return res.status(400).json("No booking ");
    }
    res.json(booking);
  
}
catch(error){
    res.json(error);
}

};

const bookingUpdate =async(req,res)=>{
    const {status}= req.body;
    const bookingId = req.params.id;

    const response = await Booking.findByIdAndUpdate(bookingId,
        {status},
        {new:true}
        );
        if(!response){
            res.status(400).json("booking failed");
        }
    
        res.json(response);
    
}



module.exports = {Signup,login,booking,bookingUpdate}