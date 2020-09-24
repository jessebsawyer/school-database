const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Course = db.define('course', {
    title: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'Please enter a title'
            }
        }
    },
    description: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'PLease enter description'
            }
        }
    },
    estimatedTime: {
        type: Sequelize.STRING
    },
    materialsNeeded: {
        type: Sequelize.STRING
    }
    

})

Course.associate = (models) => {
    Course.belongsTo(models.User);
};

module.exports = Course;