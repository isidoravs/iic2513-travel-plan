module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    comment: DataTypes.TEXT,
    score: DataTypes.FLOAT,
    reviewDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    itineraryId: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  review.associate = function (models) {
    review.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    review.belongsTo(models.itinerary, {
      foreignKey: 'itineraryId',
    });
  };
  return review;
};
