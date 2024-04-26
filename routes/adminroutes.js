const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

 router.post('/user/signup', adminController.postuserdetails);

 router.post('/user/login', adminController.userlogindetails);

 module.exports = router;