const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadItinerary(ctx, next) {
  ctx.state.itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  return next();
}
router.get('itineraries.list', '/', async (ctx) => {
  const itinerariesList = await ctx.orm.itinerary.findAll();
  await ctx.render('itineraries/index', {
    itinerariesList,
    newItineraryPath: ctx.router.url('itineraries.new'),
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
  });
});
router.get('itineraries.new', '/new', async (ctx) => {
  const itinerary = ctx.orm.itinerary.build();
  await ctx.render('itineraries/new', {
    itinerary,
    submitItineraryPath: ctx.router.url('itineraries.create'),
  });
});
router.get('itineraries.show', '/:id', loadItinerary, async (ctx) => {
  await ctx.render('itineraries/show', {
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
  });
});
router.get('itineraries.edit', '/:id/edit', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  await ctx.render('itineraries/edit', {
    itinerary,
    submitItineraryPath: ctx.router.url('itineraries.update', { id: itinerary.id }),
  });
});
router.post('itineraries.create', '/', async (ctx) => {
  const itinerary = ctx.orm.itinerary.build(ctx.request.body);
  try {
    await itinerary.save({ fields: ['itineraryName', 'budget', 'startDate', 'endDate', 'userId'] });
    const avgScore = 0;
    await itinerary.update({ avgScore });
    ctx.redirect(ctx.router.url('itineraries.list'));
  } catch (validationError) {
    await ctx.render('itineraries/new', {
      itinerary,
      errors: validationError.errors,
      submitItineraryPath: ctx.router.url('itineraries.create'),
    });
  }
});
router.patch('itineraries.update', '/:id', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  try {
    const {
      itineraryName, budget, startDate, endDate, description,
    } = ctx.request.body;
    await itinerary.update({
      itineraryName, budget, startDate, endDate, description,
    });
    ctx.redirect(ctx.router.url('itineraries.list'));
  } catch (validationError) {
    await ctx.render('itineraries/edit', {
      itinerary,
      errors: validationError.errors,
      submitItineraryPath: ctx.router.url('itineraries.update'),
    });
  }
});
router.del('itineraries.delete', '/:id', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  await itinerary.destroy();
  ctx.redirect(ctx.router.url('itineraries.list'));
});
module.exports = router;
