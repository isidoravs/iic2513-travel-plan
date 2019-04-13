module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define('activity', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    activityPicture: DataTypes.STRING,
  }, {});
  activity.associate = function(models) {
    // associations can be defined here
  };
  return activity;
};
