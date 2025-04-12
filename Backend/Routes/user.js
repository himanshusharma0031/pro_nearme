const express = require('express');
const {Signup,login, getallproviders, providerProfile, providerAvailability} = require('../Controller/user');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);
Router.get('/allproviders',  auth,getallproviders);
Router.get('/provider/:id',  auth,providerProfile);
Router.post('/provider/:id/availability',  auth,providerAvailability);
	



module.exports = Router;
