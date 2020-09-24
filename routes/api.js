// Require Varibles
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Sequelize = require('sequelize');


// Show All Users
router.get('/users', async (req, res, next) => {
    try {
        const user = await User.findAll();
        res.json(user)
    } catch (error) {
        res.json({message: error.message})
        next(error);
    }
});

// Create User
router.post('/users', async (req, res, next) => {
    try {
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        });
        res.json(user);
    } catch (error) {
        res.json({message: error.message})
        next(error);
    }
});

// Delete User
router.delete('/users/:id/delete', (req, res, next) => {
    let id = req.params.id;
    User.findByPk(id)
        .then(user => {
          user.destroy(req.body)
            .then(res.redirect('/'))
        })
        .catch(err => next(err));
})

// Show All Courses
router.get('/courses', async (req, res, next) => {
    try {
        const course = await Course.findAll();
        res.json(course);
    } catch (error) {
        res.json({message: error.message})
        next(error);
    }
});

// Show Specified Course
router.get('/courses/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        res.json(course);
    } catch (error) {
        res.json({message: error.message});
        next(error);
    }
})

// Create Course
router.post('/courses', async (req, res, next) => {
    try {
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded
        });
        res.json(course);
    } catch (error) {
        res.json({message: error.message});
    }
})

// Update Course
router.put('/courses/:id', async (req, res, next) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        course.update(req.body);
        res.json(course);
    } catch (error) {
        res.json({message: error.message});
        next(error);
    }
})

// Delete Course
router.delete('/courses/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        course.destroy();
        res.redirect('/');
    } catch (error) {
        res.json({message: error.message});
        next(error);
    }
})

module.exports = router;