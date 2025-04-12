const express = require('express');
const {Signup,login, getallproviders} = require('../Controller/user');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);
Router.get('/allproviders',  auth,getallproviders);


module.exports = Router;
