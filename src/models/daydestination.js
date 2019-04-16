module.exports = (sequelize, DataTypes) => {
  const dayDestination = sequelize.define('dayDestination', {
    day_id: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  dayDestination.associate = function (models) {
    // associations can be defined here
  };
  return dayDestination;
};
