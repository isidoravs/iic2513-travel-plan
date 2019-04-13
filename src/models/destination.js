module.exports = (sequelize, DataTypes) => {
  const destination = sequelize.define('destination', {
    destinationPicture: DataTypes.STRING,
    destinationName: DataTypes.STRING,
  }, {});
  destination.associate = function(models) {
    // associations can be defined here
  };
  return destination;
};
