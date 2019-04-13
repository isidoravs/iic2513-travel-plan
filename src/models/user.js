module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    gender: DataTypes.STRING,
    publicName: DataTypes.STRING,
    privateAccount: DataTypes.BOOLEAN,
    score: DataTypes.FLOAT,
    photo: DataTypes.STRING,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
