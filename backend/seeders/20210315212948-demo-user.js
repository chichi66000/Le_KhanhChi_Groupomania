'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      nom: 'Le',
      prenom: 'Chi',
      email: 'le.khanhchi@yahoo.fr',
      password: 'Azerty0123',
      fonction: 'secretaire',
      pseudo: 'lechi',
      avatar:'',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
