module.exports = (sequelize, DataTypes) => {
  const day = sequelize.define('day', {
    date: DataTypes.STRING,
    number: DataTypes.INTEGER,
    dayPicture: DataTypes.STRING,
  }, {});
  day.associate = function(models) {
    // associations can be defined here
  };
  return day;
};
