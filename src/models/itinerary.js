module.exports = (sequelize, DataTypes) => {
  const itinerary = sequelize.define('itinerary', {
    budget: DataTypes.FLOAT,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    labels: DataTypes.ARRAY(DataTypes.TEXT),
    itineraryPicture: DataTypes.STRING,
    description: DataTypes.TEXT,
    avgScore: DataTypes.FLOAT,
    itineraryName: DataTypes.STRING,
  }, {});
  itinerary.associate = function(models) {
    // associations can be defined here
  };
  return itinerary;
};
