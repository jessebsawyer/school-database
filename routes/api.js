// Require Varibles
const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const authenticateUser = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findAll({
            where: {
                emailAddress: credentials.name
            }
        });
        if (user) {
            const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for ${user.firstName}, ${user.lastName}.`);
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    
    // If user authentication failed...
    if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }  
};

// Show Authenticated User
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;

    res.json({
        name: user.name,
        username: user.username
    });
});

// Create User
router.post('/users', async (req, res, next) => {
    try {
        const userPass = req.body;
        userPass.password = bcryptjs.hashSync(userPass.password);

        await User.create({
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
            materialsNeeded: req.body.materialsNeeded,
            userId: req.body.userId
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