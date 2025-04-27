const express = require('express');
const {Signup,login, getallproviders, providerProfile, providerAvailability, providerbooking} = require('../Controller/user');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);
Router.post('/allproviders',getallproviders);
Router.get('/provider/:id',  auth,providerProfile);
Router.post('/provider/:id/availability',  auth,providerAvailability);
Router.post('/provider/:id/booking',  auth,providerbooking);

	



module.exports = Router;
