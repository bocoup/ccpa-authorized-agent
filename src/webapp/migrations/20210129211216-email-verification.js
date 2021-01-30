'use strict';
const {DataTypes} = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'members',
          'emailChallenge',
          {type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4},
          {transaction}
        ),
        queryInterface.addColumn(
          'members',
          'emailChallengeAt',
          {type: DataTypes.DATE},
          {transaction},
        ),
        queryInterface.addColumn(
          'members',
          'emailVerified',
          {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
          {transaction}
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('members', 'emailChallenge', {transaction}),
        queryInterface.removeColumn('members', 'emailChallengeAt', {transaction}),
        queryInterface.removeColumn('members', 'emailVerified', {transaction}),
      ]);
    });
  },
};
