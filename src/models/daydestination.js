module.exports = (sequelize, DataTypes) => {
  const dayDestination = sequelize.define('dayDestination', {
    dayId: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  dayDestination.associate = function () {
    // associations can be defined here
  };
  return dayDestination;
};
