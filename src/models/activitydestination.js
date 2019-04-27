module.exports = (sequelize, DataTypes) => {
  const activityDestination = sequelize.define('activityDestination', {
    activityId: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  activityDestination.associate = function () {
    // associations can be defined here
  };
  return activityDestination;
};
