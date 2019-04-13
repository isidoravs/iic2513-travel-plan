// eslint-disable-next-line no-var
var faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const destinationsData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        destinationPicture: faker.system.filePath(),
        destinationName: faker.address.city(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      destinationsData.push(record);
    }

    return queryInterface.bulkInsert('destinations', destinationsData);
  },

  down: queryInterface => queryInterface.bulkDelete('destinations', null, {}),
};
