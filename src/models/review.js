module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    comment: DataTypes.TEXT,
    score: DataTypes.FLOAT,
    reviewDate: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    itinerary_id: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  review.associate = function (models) {
    review.belongsTo(models.user, {
      foreignKey: 'user_id',
    });
    review.belongsTo(models.itinerary, {
      foreignKey: 'itinerary_id',
    });
  };
  return review;
};
