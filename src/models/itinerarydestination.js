module.exports = (sequelize, DataTypes) => {
  const itineraryDestination = sequelize.define('itineraryDestination', {
    itinerary_id: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  itineraryDestination.associate = function (models) {
    // associations can be defined here
  };
  return itineraryDestination;
};
