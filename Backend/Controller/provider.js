const Provider = require('../Models/provider');
const bcrypt = require ('bcryptjs');
const generatetoken = require('../config/genratetoken');

const Signup = async (req,res) =>{
const {name,email,password,location,serviceType} = req.body;
if(!email || !name || !password || !location ||!serviceType){
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
    serviceType


});

res.json(
    {_id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            location:user.location,
            serviceType:user.serviceType,
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

}

module.exports = {Signup,login}