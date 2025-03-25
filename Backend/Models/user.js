const  mongoose = require('mongoose');

const schema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:String
    },

    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "booking" }],


});

const User =  mongoose.model("User",schema);

module.exports  = User;
