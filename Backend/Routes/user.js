const express = require('express');
const {Signup,login} = require('../Controller/user');
const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/login',login);



module.exports = Router;
