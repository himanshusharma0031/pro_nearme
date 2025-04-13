const express = require('express');
const { Signup, login, booking } = require('../Controller/provider');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);
Router.post('/bookings',auth,booking);



module.exports = Router;
