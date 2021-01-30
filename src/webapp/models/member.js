'use strict';
const {
  Model,
  Op
} = require('sequelize');
const {DateTime} = require('luxon');

/**
 * The number of hours to wait between sending e-mail reminders to any given
 * member.
 */
const EMAIL_CHALLENGE_RETRY_PERIOD = 24;
/**
 * The number of hours following Member creation time to wait before ceasing to
 * send e-mail reminders to any given user.
 */
const EMAIL_CHALLENGE_QUIT_DELAY = 72;

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

    /**
     * Find all Members records which are due to receive a reminder message to
     * verify the associated e-mail address. This includes:
     *
     * - Member records for which a verification e-mail has never been sent
     * - Member records for which the most recent verification e-mail was sent
     *   over a certain number of hours in the past (see
     *   `EMAIL_CHALLENGE_RETRY_PERIOD`) and which were created within a
     *   certain time frame (see `EMAIL_CHALLENGE_QUIT_DELAY`).
     */
    static findEmailReminders() {
      const now = DateTime.local();
      const previousChallengeTime = now.sub(
        {hours: EMAIL_CHALLENGE_RETRY_PERIOD}
      ).toISO();
      const challengeQuit = now.sub({hours: EMAIL_CHALLENGE_QUIT_DELAY});

      return Member.findAll({
        where: {
          [Op.and]: [
            {emailVerified: false},
            {
              [Op.or]: [
                {emailChallengeAt: null},
                {
                  [Op.and]: [
                    {emailChallengeAt: {[Op.lt]: previousChallengeTime}},
                    {createdAt: {[Op.gte]: challengeQuit}},
                  ]
                }
              ]
            }
          ]
        }
      });
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
    }
  }, {
    sequelize,
    modelName: 'member',
  });
  return Member;
};
