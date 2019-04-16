module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define('activity', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    activityPicture: DataTypes.STRING,
    day_id: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  activity.associate = function (models) {
    activity.belongsTo(models.day, {
      foreignKey: 'day_id',
    });
    activity.belongsToMany(models.destination, {
      through: 'activityDestination',
      as: 'destinations',
      foreignKey: 'activity_id',
    });
  };
  return activity;
};
