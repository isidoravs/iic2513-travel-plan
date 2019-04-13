module.exports = (sequelize, DataTypes) => {
  const activityDestination = sequelize.define('activityDestination', {
    activity_id: DataTypes.INTEGER,
    destination_id: DataTypes.INTEGER,
  }, {});
  activityDestination.associate = function (models) {
    // associations can be defined here
  };
  return activityDestination;
};
