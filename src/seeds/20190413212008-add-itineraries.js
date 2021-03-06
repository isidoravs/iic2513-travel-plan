// eslint-disable-next-line no-var
var faker = require('faker');

module.exports = {
  up: async (queryInterface) => {
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
    const allUsers = await queryInterface.sequelize.query(
      'SELECT id from USERS;',
    );
    const allUserIds = allUsers[0];

    for (let i = 0; i < 50; i += 1) {
      const record = {
        budget: faker.commerce.price(),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
        labels: faker.lorem.words().split(' '),
        description: faker.lorem.paragraph(),
        avgScore: faker.finance.amount(0, 5, 2),
        itineraryName: faker.random.locale(),
        userId: allUserIds[i].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      itinerariesData.push(record);
    }

    return queryInterface.bulkInsert('itineraries', itinerariesData);
  },

  down: queryInterface => queryInterface.bulkDelete('itineraries', null, {}),
};
