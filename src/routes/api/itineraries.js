const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.itineraries.list_by_score', '/list_by_score', async (ctx) => {
  console.log('------------------------asdasd---------------------------');
  const itineraries = await ctx.orm.itinerary.findAll({ order: [['avgScore', 'DESC']] });
  const itineraries2 = itineraries.filter(itinerary => itinerary.avgScore);
  const itinerariesList = itineraries2.slice(0, 15);
  ctx.body = ctx.jsonSerializer('itinerary', {
    attributes: ['itineraryName', 'itineraryPicture', 'budget', 'startDate', 'endDate', 'avgScore', 'userId'],
   topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.itineraries.list')}`,
    },
    dataLinks: {
      self: (dataset, itinerary) => `${ctx.origin}/api/itineraries/${itinerary.id}`,
      user: (dataset, itinerary) => `${ctx.origin}/api/users/${itinerary.userId}`,
    },
  }).serialize(itinerariesList);
});

router.get('api.itineraries.list', '/', async (ctx) => {
  const itinerariesList = await ctx.orm.itinerary.findAll();
  ctx.body = ctx.jsonSerializer('itinerary', {
    attributes: ['itineraryName', 'description', 'budget', 'avgScore', 'startDate', 'endDate'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.itineraries.list')}`,
    },
    dataLinks: {
      self: (dataset, itinerary) => `${ctx.origin}/api/itineraries/${itinerary.id}`,
      user: (dataset, itinerary) => `${ctx.origin}/api/users/${itinerary.userId}`,
    },
  }).serialize(itinerariesList);
});


router.get('api.itineraries.list_by_date', '/list_by_date', async (ctx) => {
  console.log('------------------------asdasd---------------------------');
  const itineraries2 = await ctx.orm.itinerary.findAll({ order: [['startDate', 'DESC']] });
  const itinerariesList = itineraries2.slice(0, 15);
  ctx.body = ctx.jsonSerializer('itinerary', {
    attributes: ['itineraryName', 'itineraryPicture', 'budget', 'startDate', 'endDate', 'avgScore', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.itineraries.list')}`,
    },
    dataLinks: {
      self: (dataset, itinerary) => `${ctx.origin}/api/itineraries/${itinerary.id}`,
    },
  }).serialize(itinerariesList);
});
router.get('api.itinerary.show', '/:id', async (ctx) => {
  const itinerary = await await ctx.orm.itinerary.findById(ctx.params.id);
  ctx.body = ctx.jsonSerializer('itinerary', {
    attributes: ['itineraryName', 'budget', 'startDate', 'endDate', 'avgScore', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.itineraries.list')}:id`,
    },
  }).serialize(itinerary);
});
router.get('api.itineraries.show', '/:id', async (ctx) => {
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  const daysList = await itinerary.getDays({ order: [['number', 'ASC']] });
  const activitiesList = await Promise.all(daysList.map(d => d.getActivities()));
  const data = JSON.parse(JSON.stringify(itinerary));
  data.days = daysList;
  data.activities = activitiesList;
  ctx.body = ctx.jsonSerializer('itinerary', {
    attributes: ['itineraryName', 'description', 'budget', 'avgScore', 'startDate', 'endDate', 'days', 'activities'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.itineraries.list')}${itinerary.id}`,
      user: `${ctx.origin}/api/users/${itinerary.userId}`,
    },
  }).serialize(data);
});

module.exports = router;
