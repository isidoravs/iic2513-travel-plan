module.exports = (sequelize, DataTypes) => {
  const itineraryDestination = sequelize.define('itineraryDestination', {
    itineraryId: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  itineraryDestination.associate = function () {
    // associations can be defined here
  };
  return itineraryDestination;
};
