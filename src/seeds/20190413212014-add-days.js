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
    const daysData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        date: faker.date.past(),
        number: faker.random.number(),
        dayPicture: faker.system.filePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      daysData.push(record);
    }

    return queryInterface.bulkInsert('days', daysData);
  },

  down: queryInterface => queryInterface.bulkDelete('days', null, {}),
};
