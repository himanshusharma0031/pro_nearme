const express = require('express');
const  mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Utility-Management-System");

const schema = mongoose.Schema({

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

const User = new mongoose.model("User",schema);

module.exports  = User;
