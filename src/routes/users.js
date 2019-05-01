const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
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
  await ctx.render('users/show', {
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
  });
});
router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username', 'email', 'password'] });
    ctx.redirect(ctx.router.url('users.list'));
    const score = 0;
    await user.update({ score });
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
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update'),
    });
  }
});
router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});
module.exports = router;
