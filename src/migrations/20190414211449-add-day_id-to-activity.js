module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('activities', 'day_id', Sequelize.INTEGER);
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('activities', 'day_id');
  },
};
