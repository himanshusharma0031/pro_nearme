const express =  require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const UserRoutes = require('./Routes/user');
const ProviderRoutes = require('./Routes/povider');
  const app = express();
  const port = process.env.PORT || 5000; 
  app.use(express.json());

  app.use('/',UserRoutes);
  app.use('/proffesionals',ProviderRoutes);



  
  mongoose.connect("mongodb://localhost:27017/Utility-Management-System", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
  
  app.listen(port,()=>{
    console.log("server connected to PORT :",port);
    
  });
  