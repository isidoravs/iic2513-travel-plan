module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('itineraries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    budget: {
      type: Sequelize.FLOAT,
    },
    startDate: {
      type: Sequelize.STRING,
    },
    endDate: {
      type: Sequelize.STRING,
    },
    labels: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    itineraryPicture: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    avgScore: {
      type: Sequelize.FLOAT,
    },
    itineraryName: {
      type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('itineraries'),
};
