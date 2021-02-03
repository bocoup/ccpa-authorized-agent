'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Member.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    zipcode: DataTypes.STRING(5),
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    emailChallenge: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    emailChallengeAt: DataTypes.DATE,
    emailVerified: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    phoneChallengeAt: DataTypes.DATE,
    phoneVerified: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'member',
  });
  return Member;
};
