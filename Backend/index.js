const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require("cors");

const UserRoutes = require('./Routes/user');
const ProviderRoutes = require('./Routes/povider');
const Provider = require('./Models/provider');
const generateTimeSlots = require('./config/generateTimesSlots'); 

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: ['http://localhost:3000', 'https://pro-near-me-an2r.vercel.app','https://pro-near-me-vb3p.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/', UserRoutes);
app.use('/proffesionals', ProviderRoutes);

// ✅ Function to add time slots
const addDailyTimeSlots = async () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const formattedDate = date.toISOString().split('T')[0];

  const slots = generateTimeSlots("09:00", "17:00", 30);

  const providers = await Provider.find();

  for (const provider of providers) {
    const alreadyExists = provider.availability.some(a => a.date === formattedDate);
    if (!alreadyExists) {
      provider.availability.push({ date: formattedDate, timeSlots: slots });
      await provider.save();
    }
  }

  console.log(`✅ Time slots added for ${formattedDate}`);
};

// ✅ Run once at startup (optional)
addDailyTimeSlots().catch(err => console.error("❌ Manual time slot gen failed:", err));

// ✅ Schedule it to run daily at 7AM
cron.schedule('0 0 * * *', () => {
  console.log("⏰ Running daily slot generator...");
  addDailyTimeSlots();
});



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
  
  app.listen(port, () => {
    console.log("✅ Server running on port", port);
  });
}).catch(err => console.error("❌ MongoDB connection error:", err));
