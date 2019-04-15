module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('reviews', 'user_id', Sequelize.INTEGER);
    queryInterface.addColumn('reviews', 'itinerary_id', Sequelize.INTEGER);
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('reviews', 'user_id');
    queryInterface.removeColumn('reviews', 'itinerary_id');
  },
};
