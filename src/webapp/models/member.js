'use strict';
const {Model} = require('sequelize');
const {DateTime} = require('luxon');

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
    },
    currentStage: {
      type: DataTypes.VIRTUAL,
      get () {
        const getDaysAgo = compared => {
          const now = DateTime.local();
          const comparedParsed = DateTime.fromJSDate(compared);
          const numberOfDaysAgo = Math.floor(now.diff(comparedParsed).as('days'));
          let formattedDaysAgo;
          if (numberOfDaysAgo === 0) {
            formattedDaysAgo = '<1 days ago';
          } else if (numberOfDaysAgo === 1) {
            formattedDaysAgo = '1 day ago';
          } else {
            formattedDaysAgo = `${numberOfDaysAgo} days ago (${compared})`;
          }
          return formattedDaysAgo;
        };
        const emailVerified = this.getDataValue('emailVerified');
        const createdAt = this.getDataValue('createdAt');
        const phoneVerified = this.getDataValue('phoneVerified');
        const phoneChallengeAt = this.getDataValue('phoneChallengeAt');
        const isPendingEmail = emailVerified === false;
        const isPendingSms = phoneVerified === false;
        if (isPendingEmail) {
          return `Pending email ${getDaysAgo(createdAt)}`;
        }
        if (isPendingSms) {
          return `Pending sms ${getDaysAgo(phoneChallengeAt)}`;
        }
        return `Verified ${getDaysAgo(phoneChallengeAt)}`;
      }
    }
  }, {
    sequelize,
    modelName: 'member',
  });
  return Member;
};
