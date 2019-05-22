module.exports = (sequelize, DataTypes) => {
  const day = sequelize.define('day', {
    date: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty:{
        msg: 'Date required.'
        }
      }
    },
    number: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
            msg: 'Day number required.',
          },
      }
    },
    dayPicture: DataTypes.STRING,
    itineraryId: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  day.associate = function (models) {
    day.hasMany(models.activity, {
      foreignKey: 'dayId',
      as: 'activities',
      onDelete: 'cascade',
      hooks: true
    });
    day.belongsTo(models.itinerary, {
      foreignKey: 'itineraryId',
    });
    day.belongsToMany(models.destination, {
      through: 'dayDestination',
      as: 'destinations',
      foreignKey: 'dayId',
    });
  };
  return day;
};
