module.exports = (sequelize, DataTypes) => {
  const day = sequelize.define('day', {
    date: DataTypes.DATE,
    number: DataTypes.INTEGER,
    dayPicture: DataTypes.STRING,
  }, {});
  // eslint-disable-next-line func-names
  day.associate = function (models) {
    day.hasMany(models.activity, {
      foreignKey: 'day_id',
      as: 'activities',
    });
    day.belongsTo(models.itinerary, {
      foreignKey: 'itinerary_id',
    });
    day.belongsToMany(models.destination, {
      through: 'dayDestination',
      as: 'destinationes',
      foreignKey: 'day_id',
    });
  };
  return day;
};
