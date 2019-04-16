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
    user_id: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  itinerary.associate = function (models) {
    itinerary.belongsTo(models.user, {
      foreignKey: 'user_id',
    });
    itinerary.hasMany(models.day, {
      foreignKey: 'itinerary_id',
      as: 'days',
    });
    itinerary.hasMany(models.review, {
      foreignKey: 'itinerary_id',
      as: 'reviews',
    });
    itinerary.belongsToMany(models.destination, {
      through: 'itineraryDestination',
      as: 'destinations',
      foreignKey: 'itinerary_id',
    });
  };
  return itinerary;
};