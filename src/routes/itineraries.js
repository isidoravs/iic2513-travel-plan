const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadItinerary(ctx, next) {
  ctx.state.itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  return next();
}

async function loadDay(ctx, next) {
  ctx.state.day = await ctx.orm.day.findById(ctx.params.did);
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
  const { itinerary } = ctx.state;
  await ctx.render('itineraries/show', {
    itinerary,
    daysList: await itinerary.getDays(),
    newItineraryDayPath: itinerar => ctx.router.url('itineraries.days.new', { id: itinerar.id }),
    editItineraryPath: itinerar => ctx.router.url('itineraries.edit', { id: itinerar.id }),
    deleteItineraryPath: itinerar => ctx.router.url('itineraries.delete', { id: itinerar.id }),
    showItineraryDayPath: day => ctx.router.url('itineraries.days.show', { did: day.id, id: itinerary.id }),
    editItineraryDayPath: day => ctx.router.url('itineraries.days.edit', { did: day.id, id: itinerary.id }),
    deleteItineraryDayPath: day => ctx.router.url('itineraries.days.delete', { did: day.id, id: itinerary.id }),
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
    await itinerary.save({ fields: ['itineraryName', 'budget', 'startDate', 'endDate'] });
    const { userId } = ctx.session;
    const avgScore = 0;
    await itinerary.update({ avgScore });
    await itinerary.update({ userId });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
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

router.get('itineraries.days.new', '/:id/days', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = ctx.orm.day.build();
  await ctx.render('days/new', {
    day,
    submitItineraryDayPath: ctx.router.url('itineraries.days.create', { id: itinerary.id }),
  });
});
router.get('itineraries.days.edit', '/:id/days/:did/edit', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  await ctx.render('days/edit', {
    itinerary,
    day,
    submitItineraryDayPath: ctx.router.url('itineraries.days.update', { id: itinerary.id, did: day.id }),
  });
});
router.get('itineraries.days.show', '/:id/days/:did', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  await ctx.render('days/show', {
    itinerary,
    day,
    itineraryPath: (ctx.router.url('itineraries.show', { id: itinerary.id })),
    editItineraryDayPath: ctx.router.url('itineraries.days.edit', { id: itinerary.id, did: day.id }),
    deleteItineraryDayPath: ctx.router.url('itineraries.days.delete', { id: itinerary.id, did: day.id }),
  });
});
router.post('itineraries.days.create', '/:id/days/', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = ctx.orm.day.build(ctx.request.body);
  try {
    await day.save({ fields: ['number', 'date', 'dayPicture'] });
    const itineraryId = itinerary.id;
    await day.update({ itineraryId });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('days/new', {
      day,
      errors: validationError.errors,
      submitDayPath: ctx.router.url('days.create'),
    });
  }
});
router.patch('itineraries.days.update', '/:id/days/:did', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  try {
    const {
      number, date, dayPicture,
    } = ctx.request.body;
    await day.update({
      number, date, dayPicture,
    });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('days/edit', {
      day,
      errors: validationError.errors,
      submitDayPath: ctx.router.url('itineraries.days.update'),
    });
  }
});
router.del('itineraries.days.delete', '/:id/days/:did', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  await day.destroy();
  ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
});
module.exports = router;
