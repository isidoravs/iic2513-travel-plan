/* eslint-disable camelcase */
const KoaRouter = require('koa-router');
const cloudinary = require('cloudinary').v2;

const router = new KoaRouter();


function getSum(total, rev) {
  return total + rev.score;
}

async function loadItinerary(ctx, next) {
  ctx.state.itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  return next();
}

async function loadDay(ctx, next) {
  ctx.state.day = await ctx.orm.day.findById(ctx.params.did);
  return next();
}

async function loadActivity(ctx, next) {
  ctx.state.activity = await ctx.orm.activity.findById(ctx.params.aid);
  return next();
}

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findById(ctx.params.rid);
  return next();
}

async function ItineraryScoreUpdate(ctx, next) {
  const reviews = await ctx.orm.review.findAll({
    where: {
      itineraryId: ctx.params.id,
    },
  });
  const avgScore = (reviews.reduce(getSum, 0) / reviews.length);
  const itinerary = await ctx.orm.itinerary.findById(ctx.params.id);
  await itinerary.update({ avgScore });
  return next();
}

router.get('itineraries.list', '/', async (ctx) => {
  const itinerariesList = await ctx.orm.itinerary.findAll();
  await ctx.render('itineraries/index', {
    itinerariesList,
    usersList: await Promise.all(itinerariesList.map(i => ctx.orm.user.findById(i.userId))),
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
router.get('itineraries.show', '/:id', ItineraryScoreUpdate, loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const user = await ctx.orm.user.findById(itinerary.userId);
  const daysList = await itinerary.getDays({ order: [['number', 'ASC']] });
  const reviewsList = await itinerary.getReviews({ order: [['reviewDate', 'DESC']] });
  await ctx.render('itineraries/show', {
    user,
    showUserPath: ctx.router.url('users.show', { id: user.id }),
    itinerary,
    daysList,
    reviewsList,
    reviewsUsersList: await Promise.all(reviewsList.map(r => ctx.orm.user.findById(r.userId))),
    activitiesList: await Promise.all(daysList.map(d => d.getActivities())),
    dayDestinationsList: await Promise.all(daysList.map(d => d.getDestinations())),
    destinationsList: await itinerary.getDestinations(),
    newReviewPath: ctx.router.url('itineraries.reviews.new', { id: itinerary.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.itineraries.delete', { id: itinerary.id, dest_id: destination.id }),
    newItineraryDayPath: itinerar => ctx.router.url('itineraries.days.new', { id: itinerar.id }),
    editItineraryPath: itinerar => ctx.router.url('itineraries.edit', { id: itinerar.id }),
    deleteItineraryPath: itinerar => ctx.router.url('itineraries.delete', { id: itinerar.id }),
    showItineraryDayPath: day => ctx.router.url('itineraries.days.show', { did: day.id, id: itinerary.id }),
    editItineraryDayPath: day => ctx.router.url('itineraries.days.edit', { did: day.id, id: itinerary.id }),
    deleteItineraryDayPath: day => ctx.router.url('itineraries.days.delete', { did: day.id, id: itinerary.id }),
    newDayActivityPath: day => ctx.router.url('itineraries.days.activities.new', { did: day.id, id: itinerary.id }),
    editDayActivityPath: (d, a) => ctx.router.url('itineraries.days.activities.edit', { id: itinerary.id, did: d.id, aid: a.id }),
    deleteDayActivityPath: (d, a) => ctx.router.url('itineraries.days.activities.delete', { id: itinerary.id, did: d.id, aid: a.id }),
    showReviewPath: review => ctx.router.url('itineraries.reviews.show', { id: itinerary.id, rid: review.id }),
    editReviewPath: review => ctx.router.url('itineraries.reviews.edit', { id: itinerary.id, rid: review.id }),
    deleteReviewPath: review => ctx.router.url('itineraries.reviews.delete', { id: itinerary.id, rid: review.id }),
    newDestinationPath: ctx.router.url('destinations.itinerary.new', { id: itinerary.id }),
    addDestinationPath: ctx.router.url('destinations.assign', { id: itinerary.id }),
    newDestinationDayPath: day => ctx.router.url('itineraries.days.destinations.new', { did: day.id, id: itinerary.id }),
    submitReviewPath: ctx.router.url('itineraries.reviews.create', { id: itinerary.id }),
    submitDayActivityPath: day => ctx.router.url('itineraries.days.activities.create', { id: itinerary.id, did: day.id }),
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
    const image = ctx.request.files.file;
    cloudinary.uploader.upload(image.path, async (error, result) => {
      const itineraryPicture = result.secure_url;
      await itinerary.update({ itineraryPicture });
      itinerary.save();
    });
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
    const image = ctx.request.files.file;
    const {
      itineraryName, budget, startDate, endDate, description,
    } = ctx.request.body;
    cloudinary.uploader.upload(image.path, async (error, result) => {
      const itineraryPicture = result.secure_url;
      await itinerary.update({ itineraryPicture });
      itinerary.save();
    });
    await itinerary.update({
      itineraryName, budget, startDate, endDate, description,
    });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('itineraries/edit', {
      itinerary,
      errors: validationError.errors,
      submitItineraryPath: ctx.router.url('itineraries.update', { id: itinerary.id }),
    });
  }
});
router.del('itineraries.delete', '/:id', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  await itinerary.destroy();
  ctx.redirect(ctx.router.url('itineraries.list'));
});

router.get('itineraries.reviews.list', '/:id/reviews/', ItineraryScoreUpdate, loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const reviewsList = await itinerary.getReviews({ order: [['reviewDate', 'DESC']] });
  await ctx.render('reviews/index', {
    itinerary,
    reviewsList,
    newReviewPath: ctx.router.url('itineraries.reviews.new', { id: itinerary.id }),
    showReviewPath: review => ctx.router.url('itineraries.reviews.show', { id: itinerary.id, rid: review.id }),
    editReviewPath: review => ctx.router.url('itineraries.reviews.edit', { id: itinerary.id, rid: review.id }),
    deleteReviewPath: review => ctx.router.url('itineraries.reviews.delete', { id: itinerary.id, rid: review.id }),
  });
});
router.get('itineraries.reviews.new', '/:id/reviews/new', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const review = ctx.orm.review.build();
  const { currentUser } = ctx.state;
  const existent = await ctx.orm.review.findAll({
    where: {
      userId: currentUser.id,
      itineraryId: itinerary.id,
    },
  });
  if (existent.length > 0) {
    await review.destroy();
    const rev = existent[0];
    ctx.redirect(ctx.router.url('itineraries.reviews.edit', { id: itinerary.id, rid: rev.id }));
  }
  await ctx.render('reviews/new', {
    itinerary,
    review,
    submitReviewPath: ctx.router.url('itineraries.reviews.create', { id: itinerary.id }),
  });
});
router.get('itineraries.reviews.edit', '/:id/reviews/:rid/edit', loadItinerary, loadReview, async (ctx) => {
  const { review } = ctx.state;
  const { itinerary } = ctx.state;
  await ctx.render('reviews/edit', {
    itinerary,
    review,
    submitReviewPath: ctx.router.url('itineraries.reviews.update', { id: itinerary.id, rid: review.id }),
  });
});
router.get('itineraries.reviews.show', '/:id/reviews/:rid/', loadItinerary, loadReview, async (ctx) => {
  const { itinerary } = ctx.state;
  await ctx.render('reviews/show', {
    itinerary,
    editReviewPath: review => ctx.router.url('itineraries.reviews.edit', { id: itinerary.id, rid: review.id }),
    deleteReviewPath: review => ctx.router.url('itineraries.reviews.delete', { id: itinerary.id, rid: review.id }),
  });
});

router.post('itineraries.reviews.create', '/:id/reviews/', loadItinerary, async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  const { itinerary } = ctx.state;
  const { currentUser } = ctx.state;
  try {
    await review.save({ fields: ['comment', 'score'] });
    const reviewDate = new Date();
    const itineraryId = itinerary.id;
    const userId = currentUser.id;
    await review.update({ reviewDate, itineraryId, userId });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('itineraries.reviews.create', { id: itinerary.id }),
    });
  }
});
router.patch('itineraries.reviews.update', '/:id/reviews/:rid/', loadItinerary, loadReview, async (ctx) => {
  const { review } = ctx.state;
  const { itinerary } = ctx.state;
  try {
    const {
      comment, score,
    } = ctx.request.body;
    await review.update({
      comment, score,
    });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('itineraries.reviews.update', { id: itinerary.id }),
    });
  }
});
router.del('itineraries.reviews.delete', '/:id/reviews/:rid', loadItinerary, loadReview, async (ctx) => {
  const { review } = ctx.state;
  const { itinerary } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
});


router.get('itineraries.days.new', '/:id/days/new', loadItinerary, async (ctx) => {
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
  const { day } = ctx.state;
  await ctx.render('days/show', {
    itinerary,
    day,
    activitiesList: await day.getActivities(),
    newDayActivityPath: ctx.router.url('itineraries.days.activities.new', { id: itinerary.id, did: day.id }),
    showDayActivityPath: a => ctx.router.url('itineraries.days.activities.show', { id: itinerary.id, did: day.id, aid: a.id }),
    editDayActivityPath: a => ctx.router.url('itineraries.days.activities.edit', { id: itinerary.id, did: day.id, aid: a.id }),
    deleteDayActivityPath: a => ctx.router.url('itineraries.days.activities.delete', { id: itinerary.id, did: day.id, aid: a.id }),
    itineraryPath: (ctx.router.url('itineraries.show', { id: itinerary.id })),
    dayPath: (ctx.router.url('itineraries.day.show', { id: itinerary.id, did: day.id })),
    editItineraryDayPath: ctx.router.url('itineraries.days.edit', { id: itinerary.id, did: day.id }),
    deleteItineraryDayPath: ctx.router.url('itineraries.days.delete', { id: itinerary.id, did: day.id }),
  });
});
router.post('itineraries.days.create', '/:id/days/create', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = ctx.orm.day.build(ctx.request.body);
  try {
    const image = ctx.request.files.file;
    cloudinary.uploader.upload(image.path, async (error, result) => {
      const dayPicture = result.secure_url;
      await day.update({ dayPicture });
      day.save();
    });
    await day.save({ fields: ['number', 'date', 'dayPicture'] });
    const itineraryId = itinerary.id;
    await day.update({ itineraryId });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('days/new', {
      day,
      errors: validationError.errors,
      submitItineraryDayPath: ctx.router.url('itineraries.days.create', { id: itinerary.id }),
    });
  }
});
router.patch('itineraries.days.update', '/:id/days/:did/update', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  try {
    const image = ctx.request.files.file;
    const { number, date } = ctx.request.body;
    cloudinary.uploader.upload(image.path, async (error, result) => {
      const dayPicture = result.secure_url;
      await day.update({ dayPicture });
      day.save();
    });
    await day.update({ number, date });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('days/edit', {
      day,
      errors: validationError.errors,
      submitDayPath: ctx.router.url('itineraries.days.update'),
    });
  }
});
router.del('itineraries.days.delete', '/:id/days/:did/delete', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  await day.destroy();
  ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
});


router.get('itineraries.days.activities.new', '/:id/days/:did/activities/new', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const { day } = ctx.state;
  const activity = ctx.orm.activity.build();
  await ctx.render('activities/new', {
    itinerary,
    day,
    activity,
    submitDayActivityPath: ctx.router.url('itineraries.days.activities.create', { id: itinerary.id, did: day.id }),
  });
});

router.get('itineraries.days.activities.edit', '/:id/days/:did/activities/:aid/edit', loadItinerary, loadDay, loadActivity, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  const activity = await ctx.orm.activity.findById(ctx.params.aid);
  await ctx.render('activities/edit', {
    itinerary,
    day,
    activity,
    submitDayActivityPath: ctx.router.url('itineraries.days.activities.update', { id: itinerary.id, did: day.id, aid: activity.id }),
  });
});
router.get('itineraries.days.activities.show', '/:id/days/:did/activities/:aid', loadItinerary, loadDay, loadActivity, async (ctx) => {
  const { itinerary } = ctx.state;
  const { day } = ctx.state;
  const { activity } = ctx.state;
  await ctx.render('activities/show', {
    itinerary,
    day,
    activity,
    itineraryPath: (ctx.router.url('itineraries.show', { id: itinerary.id })),
    dayPath: (ctx.router.url('itineraries.days.show', { id: itinerary.id, did: day.id })),
    editDayActivityPath: ctx.router.url('itineraries.days.activities.edit', { id: itinerary.id, did: day.id, aid: activity.id }),
    deleteDayActivityPath: ctx.router.url('itineraries.days.activities.delete', { id: itinerary.id, did: day.id, aid: activity.id }),
  });
});
router.post('itineraries.days.activities.create', '/:id/days/:did/activities', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  const activity = ctx.orm.activity.build(ctx.request.body);
  try {
    await activity.save({ fields: ['title', 'activityPictue', 'description'] });
    const dayId = day.id;
    await activity.update({ dayId });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('activities/new', {
      itinerary,
      day,
      activity,
      errors: validationError.errors,
      submitDayActivityPath: ctx.router.url('itienraries.days.activities.create'),
    });
  }
});
router.patch('itineraries.days.activities.update', '/:id/days/:did/activities/:aid/update', loadItinerary, loadDay, loadActivity, async (ctx) => {
  const { itinerary } = ctx.state;
  const day = await ctx.orm.day.findById(ctx.params.did);
  const activity = await ctx.orm.activity.findById(ctx.params.aid);
  try {
    const {
      title, description,
    } = ctx.request.body;
    await activity.update({
      title, description,
    });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    await ctx.render('activities/edit', {
      day,
      activity,
      errors: validationError.errors,
      submitDayActivityPath: ctx.router.url('itineraries.days.update'),
    });
  }
});
router.del('itineraries.days.activities.delete', '/:id/days/:did/activities/:aid/', loadItinerary, loadDay, async (ctx) => {
  const { itinerary } = ctx.state;
  const activity = await ctx.orm.activity.findById(ctx.params.aid);
  await activity.destroy();
  ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
});

router.get('itineraries.days.destinations.new', '/:id/days/:did/destinations/new', loadItinerary, loadDay, async (ctx) => {
  const destination = ctx.orm.destination.build();
  const { itinerary } = ctx.state;
  const { day } = ctx.state;
  await ctx.render('destinations/new', {
    itinerary,
    day,
    destination,
    submitDestinationPath: ctx.router.url('itineraries.days.destinations.create', { id: itinerary.id, did: day.id }),
  });
});

router.post('itineraries.days.destinations.create', '/:id/days/:did/destinations', loadItinerary, async (ctx) => {
  const { itinerary } = ctx.state;
  const destination = ctx.orm.destination.build(ctx.request.body);
  const day = await ctx.orm.day.findById(ctx.params.did);
  const dayDestination = ctx.orm.dayDestination.build();
  const itineraryDestination = ctx.orm.itineraryDestination.build();
  try {
    destination.destinationName = destination.destinationName.toLowerCase();
    await destination.save({ fields: ['destinationName', 'destinationPicture'] });
    const dayId = day.id;
    const itineraryId = itinerary.id;
    // eslint-disable-next-line camelcase
    const destination_id = destination.id;
    await dayDestination.update({ dayId, destination_id });
    await itineraryDestination.update({ itineraryId, destination_id });
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
  } catch (validationError) {
    const d_name = ctx.request.body.destinationName.toLowerCase();
    const destination_e = await ctx.orm.destination.findAll({
      where: {
        destinationName: d_name,
      },
    });
    const dayId = day.id;
    const itineraryId = itinerary.id;
    const destination_id = destination_e[0].id;
    const exist = await ctx.orm.itineraryDestination.findAll({
      where: {
        itineraryId,
        destination_id,
      },
    });
    await dayDestination.update({ dayId, destination_id });
    if (!exist.length) {
      await itineraryDestination.update({ itineraryId, destination_id });
    }
    ctx.redirect(ctx.router.url('itineraries.show', { id: itinerary.id }));
    // await ctx.render('destinations/new', {
    //   destination,
    //   errors: validationError.errors,
    //   submitDestinationPath: ctx.router.url('destinations.create'),
    // });
  }
});
module.exports = router;
