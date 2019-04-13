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
    const activitiesData = [];
    for (let i = 0; i < 50; i += 1) {
      const record = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        activityPicture: faker.system.filePath(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      activitiesData.push(record);
    }

    return queryInterface.bulkInsert('activities', activitiesData);
  },

  down: queryInterface => queryInterface.bulkDelete('activities', null, {}),
};
