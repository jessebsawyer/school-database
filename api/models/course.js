'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: {
            fieldName: 'userId',
            allowNull: false
        }
    });
    }
  };
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
              msg: 'Please enter a title'
          }
      }
  },
  description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
          notEmpty: {
              msg: 'PLease enter description'
          }
      }
  },
  estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
  }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};