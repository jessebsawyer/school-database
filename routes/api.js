// Require Varibles
const express = require('express');
const router = express.Router();
const { Course, User, sequelize } = require('../models');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator');

const authenticateUser = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({
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
        name: user.firstName,
        username: user.emailAddress
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
      .withMessage('Please provide a value for "emailAddress"'),
    check('password')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "password"')  
  ], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Use the Array `map()` method to get a list of error messages.
            const errorMessages = errors.array().map(error => error.msg);
        
            // Return the validation errors to the client.
            return res.status(400).json({ errors: errorMessages });
        } else {
            const userPass = req.body;
            userPass.password = bcryptjs.hashSync(userPass.password);
    
            await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                emailAddress: req.body.emailAddress,
                password: req.body.password
            });
            return res.status(201).end();
        }
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
router.post('/courses', authenticateUser, async (req, res, next) => {
    try {
        const user = req.currentUser;
        await Course.create({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            userId: user.id
        });
        return res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ errors: error.message });
        } else {
            next(error);
        }
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