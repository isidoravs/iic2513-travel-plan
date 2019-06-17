const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  ctx.body = ctx.jsonSerializer('user', {
    attributes: ['username', 'publicName', 'email', 'birthDate', 'country', 'gender'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.users.list')}`,
    },
    dataLinks: {
      self: (dataset, user) => `${ctx.origin}/api/users/${user.id}`,
    },
  }).serialize(usersList);
});

router.get('api.user.show', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  const itinerariesList = await user.getItineraries();
  const data = JSON.parse(JSON.stringify(user));
  data.itineraries = itinerariesList;
  ctx.body = ctx.jsonSerializer('user', {
    attributes: ['username', 'publicName', 'email', 'birthDate', 'country', 'gender', 'itineraries'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.users.list')}${user.id}`,
    },
  }).serialize(data);
});

module.exports = router;
