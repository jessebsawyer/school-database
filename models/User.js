const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    firstName: {
        type: Sequelize.STRING, 
        validate: {
            notEmpty: {
                msg: 'Please enter first name'
            }
        }
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'PLease enter last name'
            }
        }
    },
    emailAddress: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'PLease enter an email'
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'Please enter a password'
            }
        }
    }
});

module.exports = User;