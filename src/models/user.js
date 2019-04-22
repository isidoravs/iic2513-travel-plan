const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

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
      foreignKey: 'user_id',
      as: 'itineraries',
    });
    user.hasMany(models.review, {
      foreignKey: 'user_id',
      as: 'reviews',
    });
  };

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return user;
};
