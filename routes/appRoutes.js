const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const mainController = require('../controllers/mainController');

router.get('/', mainController.getHomePage);



module.exports = router;