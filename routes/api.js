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
        console.log(user);
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
router.get('/users', authenticateUser, async (req, res, next) => {
    const user = req.currentUser;
    try {
        const authUser = await User.findOne({
            attributes: {exclude: ["password", "createdAt", "updatedAt"]},
            where: {
                emailAddress: user.emailAddress
            }
        })
        res.json(authUser);
    } catch (error) {
        next(error);
    }
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
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({message: error.message});
        } else if (error.name === 'SequelizeValidationError'){
            res.status(400).json({message: error.message});
        } else {
            next(error);
        }
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
        const course = await Course.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            include: [{
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
            }]
        });
        res.json(course);
    } catch (error) {
        res.json({message: error.message})
        next(error);
    }
});

// Show Specified Course
router.get('/courses/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            attributes: { exclude: ['createdAt', 'updatedAt']},
            include: [{
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
            }]
        });
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
router.put('/courses/:id', authenticateUser, async (req, res, next) => {
    let course;
    const user = req.currentUser;
    try {
        course = await Course.findByPk(req.params.id);
        if (user.id === course.userId) {
            course.update(req.body);
            res.status(204).end();
        } else {
            res.status(403).json({message: `${user.firstName} is not authorized to make changes.`});
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ errors: error.message });
        } else {
            next(error);
        }
    }
})

// Delete Course
router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
    const user = req.currentUser;
    try {
        const course = await Course.findByPk(req.params.id);
        if (user.id === course.userId) {
            course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({message: `${user.firstName} is not authorized to make changes.`});
        }
    } catch (error) {
        res.status(400).json({ errors: error.message });
        next(error);
    }
})

module.exports = router;