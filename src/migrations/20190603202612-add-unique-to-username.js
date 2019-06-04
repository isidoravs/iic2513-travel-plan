module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('users', ['username'], {
      type: 'unique',
      name: 'unique-username',
    });
  },

   down(queryInterface) {
    return queryInterface.removeConstraint('users', 'unique-username');
  },
};
