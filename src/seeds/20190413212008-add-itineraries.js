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
    const itinerariesData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        budget: faker.commerce.price(),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
        labels: faker.lorem.words().split(' '),
        itineraryPicture: faker.system.filePath(),
        description: faker.lorem.paragraph(),
        avgScore: faker.random.number(),
        itineraryName: faker.random.locale(),
        userId: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      itinerariesData.push(record);
    }

    return queryInterface.bulkInsert('itineraries', itinerariesData);
  },

  down: queryInterface => queryInterface.bulkDelete('itineraries', null, {}),
};
