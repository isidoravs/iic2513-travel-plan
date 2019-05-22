module.exports = (sequelize, DataTypes) => {
  const itinerary = sequelize.define('itinerary', {
    budget: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          msg: 'Budget required'
        },
      }
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    labels: DataTypes.ARRAY(DataTypes.TEXT),
    itineraryPicture: DataTypes.STRING,
    description: DataTypes.TEXT,
    avgScore: DataTypes.FLOAT,
    itineraryName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name required'
        }
      }
    },
    userId: DataTypes.INTEGER,
  }, {});
  // eslint-disable-next-line func-names
  itinerary.associate = function (models) {
    itinerary.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    itinerary.hasMany(models.day, {
      foreignKey: 'itineraryId',
      as: 'days',
      onDelete: 'cascade',
      hooks: true
    });
    itinerary.hasMany(models.review, {
      foreignKey: 'itineraryId',
      as: 'reviews',
      onDelete: 'cascade',
      hooks: true
    });
    itinerary.belongsToMany(models.destination, {
      through: 'itineraryDestination',
      as: 'destinations',
      foreignKey: 'itineraryId',
    });
  };
  return itinerary;
};
