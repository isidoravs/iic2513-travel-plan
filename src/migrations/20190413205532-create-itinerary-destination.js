module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('itineraryDestinations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    itinerary_id: {
      type: Sequelize.INTEGER,
    },
    destination_id: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('itineraryDestinations'),
};
