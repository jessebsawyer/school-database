// Require Varibles
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Sequelize = require('sequelize');


// Show All Users
router.get('/users', (req, res, next) => 
User.findAll()
    .then(user => {
        res.json(user);
    })
    .catch(err => next(err))
);

module.exports = router;