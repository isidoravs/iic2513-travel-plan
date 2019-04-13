
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('days', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.INTEGER,
    },
    dayPicture: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('days'),
};
