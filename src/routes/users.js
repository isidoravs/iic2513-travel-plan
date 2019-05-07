const KoaRouter = require('koa-router');

const router = new KoaRouter();

const sendSignUpAlertEmail = require('../mailers/sign-up-alert');

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}
async function loadItinerary(ctx, next) {
  ctx.state.itinerary = await ctx.orm.itinerary.findById(ctx.params.iid);
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    itinerariesListPath: ctx.router.url('itineraries.list'),
    userItinerariesPath: user => ctx.router.url('user.itineraries', { id: user.id }),
    showUserPath: user => ctx.router.url('users.show', { id: user.id }),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
  });
});
router.get('user.itineraries', '/:id/itineraries', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/itineraries', {
    userName: user.username,
    itinerariesList: await user.getItineraries(),
    itinerariesListPath: ctx.router.url('itineraries.list'),
    usersListPath: ctx.router.url('users.list'),
    newItineraryPath: ctx.router.url('itineraries.new'),
    showItineraryPath: itinerary => ctx.router.url('user.itineraries.show', { id: user.id, iid: itinerary.id }),
  });
});
router.get('user.itineraries.show', '/:id/itineraries/:iid', loadUser, loadItinerary, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/itinerary_show', {
    userName: user.username,
    editItineraryPath: itinerary => ctx.router.url('itineraries.edit', { id: itinerary.id }),
    deleteItineraryPath: itinerary => ctx.router.url('itineraries.delete', { id: itinerary.id }),
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
  });
});
router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});
router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});
router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/show', {
    itinerariesList: await user.getItineraries(),
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
    showItineraryPath: itinerary => ctx.router.url('itineraries.show', { id: itinerary.id }),
  });
});
router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username', 'email', 'password'] });
    ctx.redirect(ctx.router.url('sessions.new'));
    const score = 0;
    await user.update({ score });
    await sendSignUpAlertEmail(ctx, { user });
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});
router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      username, email, password, birthDate, gender, country, publicName, photo,
    } = ctx.request.body;
    await user.update({
      username, email, password, birthDate, gender, country, publicName, photo,
    });
    ctx.redirect(ctx.router.url('users.show', { id: user.id }));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});
router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});
module.exports = router;
