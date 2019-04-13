module.exports = (sequelize, DataTypes) => {
  const itinerary = sequelize.define('itinerary', {
    budget: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    labels: DataTypes.ARRAY(DataTypes.TEXT),
    itineraryPicture: DataTypes.STRING,
    description: DataTypes.TEXT,
    avgScore: DataTypes.FLOAT,
    itineraryName: DataTypes.STRING,
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
      as: 'destinationes',
      foreignKey: 'itinerary_id',
    });
  };
  return itinerary;
};
