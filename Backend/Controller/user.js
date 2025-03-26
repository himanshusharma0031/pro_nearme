const User = require('../Models/user');
const bcrypt = require ('bcryptjs');

const Signup = async (req,res) =>{
const {name,email,password,location} = req.body;
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

});

res.json(user);
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

}

module.exports = {Signup,login}