const mongoose = require('mongoose');;


const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
    date: String,
    time: String,
    status: { type: String, enum: ["pending", "confirmed", "completed", "canceled"], default: "pending" }
    
  });
  
  BookingSchema.index(
    { userId: 1, providerId: 1, date: 1, time: 1, status: 1 },
    { unique: true }
  );
  
  
  module.exports  = mongoose.model("Booking", BookingSchema);
  