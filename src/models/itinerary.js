module.exports = (sequelize, DataTypes) => {
  const itinerary = sequelize.define('itinerary', {
    budget: DataTypes.FLOAT,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    labels: DataTypes.ARRAY(DataTypes.TEXT),
    itineraryPicture: DataTypes.STRING,
    description: DataTypes.TEXT,
    avgScore: DataTypes.FLOAT,
    itineraryName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  itinerary.associate = function (models) {
    itinerary.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    itinerary.hasMany(models.day, {
      foreignKey: 'itineraryId',
      as: 'days',
    });
    itinerary.hasMany(models.review, {
      foreignKey: 'itineraryId',
      as: 'reviews',
    });
    itinerary.belongsToMany(models.destination, {
      through: 'itineraryDestination',
      as: 'destinations',
      foreignKey: 'itineraryId',
    });
  };
  return itinerary;
};
