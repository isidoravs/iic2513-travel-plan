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
    const usersData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthDate: faker.date.past(),
        password: faker.internet.password(),
        country: faker.address.country(),
        gender: faker.name.prefix(),
        publicName: faker.name.firstName(),
        privateAccount: faker.random.boolean(),
        score: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      usersData.push(record);
    }

    return queryInterface.bulkInsert('users', usersData);
  },

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
