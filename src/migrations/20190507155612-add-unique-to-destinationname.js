module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('destinations', ['destinationName'], {
      type: 'unique',
      name: 'uniqueUsername',
    });
  },

   down(queryInterface) {
    return queryInterface.removeConstraint('destinations', 'uniqueUsername');
  },
};
