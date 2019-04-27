module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define('activity', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    activityPicture: DataTypes.STRING,
    dayId: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  activity.associate = function (models) {
    activity.belongsTo(models.day, {
      foreignKey: 'dayId',
    });
    activity.belongsToMany(models.destination, {
      through: 'activityDestination',
      as: 'destinations',
      foreignKey: 'activityId',
    });
  };
  return activity;
};
