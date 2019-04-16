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
    const reviewsData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        comment: faker.lorem.paragraph(),
        score: faker.random.number(),
        reviewDate: faker.date.recent(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      reviewsData.push(record);
    }

    return queryInterface.bulkInsert('reviews', reviewsData);
  },

  down: queryInterface => queryInterface.bulkDelete('reviews', null, {}),
};
