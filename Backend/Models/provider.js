const mongoose = require('mongoose');

const schema  = new mongoose.Schema({
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
    serviceType:{
        type:String
    },
    
    availability: [{ date: String, timeSlots: [String] }], 


     bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "booking" }],


});

const Provider = mongoose.model('provider',schema);

module.exports = Provider;
