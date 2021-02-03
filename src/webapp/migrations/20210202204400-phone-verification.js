'use strict';
const {DataTypes} = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'members',
          'phoneVerified',
          {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
          {transaction}
        ),
        queryInterface.addColumn(
          'members',
          'phoneChallengeAt',
          {type: DataTypes.DATE},
          {transaction},
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('members', 'phoneVerified', {transaction}),
        queryInterface.removeColumn('members', 'phoneChallengeAt', {transaction}),
      ]);
    });
  },
};
