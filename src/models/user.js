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
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Ese nombre de usuario ya está en uso.',
      },
      validate: {
        notEmpty: {
          msg: 'Username required.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already exists.',
      },
      validate: {
        notEmpty: {
          msg: 'Email required.',
        },
        isEmail: {
          msg: 'Email wrong format',
        },
      },
    },
    birthDate: DataTypes.DATEONLY,
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password required.',
        },
        len: {
          args: [6],
          msg: 'Password of at least 6 characters',
        },
      },
    },
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
      onDelete: 'cascade',
      hooks: true
    });
    user.hasMany(models.review, {
      foreignKey: 'userId',
      as: 'reviews',
      onDelete: 'cascade',
      hooks: true
    });
  };

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return user;
};
