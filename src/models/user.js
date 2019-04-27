module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    gender: DataTypes.STRING,
    publicName: DataTypes.STRING,
    privateAccount: DataTypes.BOOLEAN,
    score: DataTypes.FLOAT,
    photo: DataTypes.STRING,
  }, {});
  // eslint-disable-next-line func-names
  user.associate = function (models) {
    user.hasMany(models.itinerary, {
      foreignKey: 'userId',
      as: 'itineraries',
    });
    user.hasMany(models.review, {
      foreignKey: 'userId',
      as: 'reviews',
    });
  };
  return user;
};
