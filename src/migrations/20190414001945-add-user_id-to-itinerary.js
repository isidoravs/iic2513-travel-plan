module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('itineraries', 'user_id', Sequelize.INTEGER);
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('itineraries', 'user_id');
  },
};
