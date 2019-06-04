const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.destinations.list', '/', async (ctx) => {
  const destinationsList = await ctx.orm.destination.findAll();
  ctx.body = ctx.jsonSerializer('destination', {
    attributes: ['destinationName'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.destinations.list')}`,
    },
    dataLinks: {
      self: (dataset, destination) => `${ctx.origin}/api/destinations/${destination.id}`,
    },
  }).serialize(destinationsList);
});

router.get('api.destination.show', '/:id', async (ctx) => {
  const destination = await ctx.orm.destination.findById(ctx.params.id);
  ctx.body = ctx.jsonSerializer('destination', {
    attributes: ['destinationName'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.destinations.list')}:id`,
    },
  }).serialize(destination);
});

router.post('api.destinations.create', '/', async (ctx) => {
  const data = JSON.parse(ctx.request.body);
  data.forEach(async (dest) => {
    console.log(dest);
    // eslint-disable-next-line no-underscore-dangle
    if (dest.__isNew__) {
      const destination = ctx.orm.destination.build();
      // const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
    }
  });
});

module.exports = router;
