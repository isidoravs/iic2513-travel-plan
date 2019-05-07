module.exports = (sequelize, DataTypes) => {
  const destination = sequelize.define('destination', {
    destinationPicture: DataTypes.STRING,
    destinationName: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Destination already exists.'
      }
    },
  }, {});
  // eslint-disable-next-line func-names
  destination.associate = function (models) {
    destination.belongsToMany(models.itinerary, {
      through: 'itineraryDestination',
      as: 'itineraries',
      foreignKey: 'destination_id',
    });
    destination.belongsToMany(models.day, {
      through: 'dayDestination',
      as: 'days',
      foreignKey: 'destination_id',
    });
    destination.belongsToMany(models.activity, {
      through: 'activityDestination',
      as: 'activities',
      foreignKey: 'destination_id',
    });
  };
  return destination;
};
