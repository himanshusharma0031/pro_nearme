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

schema.pre('save',async (next)=>{
     if (!this.isModified) {
         next();
      
        }
      
        const salt = await bcrypt.genSalt(10);
        this.password =  await bcrypt.hash(this.password,salt);
})

const Provider = mongoose.model('provider',schema);

module.exports = Provider;
