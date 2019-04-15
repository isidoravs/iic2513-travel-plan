module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('days', 'itinerary_id', Sequelize.INTEGER);
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('days', 'itinerary_id');
  },
};
