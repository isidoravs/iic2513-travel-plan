module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    birthDate: {
      type: Sequelize.DATEONLY,
    },
    password: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
    publicName: {
      type: Sequelize.STRING,
    },
    privateAccount: {
      type: Sequelize.BOOLEAN,
    },
    score: {
      type: Sequelize.FLOAT,
    },
    photo: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
