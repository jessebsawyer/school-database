// Require Varibles
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {check, validationResult} = require('express-validator');

const authenticateUser = (req, res, next) => {
    let message = null;
    const credentials = auth(req);

    if (credentials) {
        User.findAll()
            .then(user => {
                user.emailAddress === credentials.name
                if (user) {
                    const authenticated = bcryptjs
                        .compareSync(credentials.pass, user.password);
                    if (authenticated) {
                        console.log(`Authentication successful for username: ${user.emailAddress}`);
                        req.currentUser = user;
                    } else {
                        message = `Authentication failure for email: ${user.emailAddress}`;
                    }
                } else {
                    message = `User not found for email: ${credentials.name}`;
                }
            });
            
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
    } else {
        next();
    }

}

// Show All Users
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password

    });
});

// Create User
router.post('/users', [
    check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "firstName"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lastName"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"'),
  check('password')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a password')   
], async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const user = req.body;
        user.password = bcryptjs.hashSync(user.password);

        const User = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        });
        return res.status(201).end();
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