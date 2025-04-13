const express = require('express');
const { Signup, login, booking, bookingUpdate } = require('../Controller/provider');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);
Router.get('/bookings',auth,booking);
Router.put('/bookings/update/:id',auth,bookingUpdate);





module.exports = Router;
