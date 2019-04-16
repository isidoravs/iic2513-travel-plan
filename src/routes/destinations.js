const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadDestination(ctx, next) {
  ctx.state.destination = await ctx.orm.destination.findById(ctx.params.id);
  return next();
}

router.get('destinations.list', '/', async (ctx) => {
  const destinationsList = await ctx.orm.destination.findAll();
  await ctx.render('destinations/index', {
    destinationsList,
    newDestinationPath: ctx.router.url('destinations.new'),
    showDestinationPath: destination => ctx.router.url('destinations.show', { id: destination.id }),
    editDestinationPath: destination => ctx.router.url('destinations.edit', { id: destination.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.delete', { id: destination.id }),
  });
});

router.get('destinations.new', '/new', async (ctx) => {
  const destination = ctx.orm.destination.build();
  await ctx.render('destinations/new', {
    destination,
    submitDestinationPath: ctx.router.url('destinations.create'),
  });
});

router.get('destinations.edit', '/:id/edit', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  await ctx.render('destinations/edit', {
    destination,
    submitDestinationPath: ctx.router.url('destinations.update', { id: destination.id }),
  });
});

router.get('destinations.show', '/:id', loadDestination, async (ctx) => {
  await ctx.render('destinations/show', {
    editDestinationPath: destination => ctx.router.url('destinations.edit', { id: destination.id }),
    deleteDestinationPath: destination => ctx.router.url('destinations.delete', { id: destination.id }),
  });
});

router.post('destinations.create', '/', async (ctx) => {
  const destination = ctx.orm.destination.build(ctx.request.body);
  try {
    await destination.save({ fields: ['destinationName', 'destinationPicture'] });
    ctx.redirect(ctx.router.url('destinations.list'));
  } catch (validationError) {
    await ctx.render('destinations/new', {
      destination,
      errors: validationError.errors,
      submitDestinationPath: ctx.router.url('destinations.create'),
    });
  }
});

router.patch('destinations.update', '/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  try {
    const {
      destinationName,
    } = ctx.request.body;
    await destination.update({
      destinationName,
    });
    ctx.redirect(ctx.router.url('destinations.list'));
  } catch (validationError) {
    await ctx.render('destinations/edit', {
      destination,
      errors: validationError.errors,
      submitDestinationPath: ctx.router.url('destinations.update'),
    });
  }
});

router.del('destinations.delete', '/:id', loadDestination, async (ctx) => {
  const { destination } = ctx.state;
  await destination.destroy();
  ctx.redirect(ctx.router.url('destinations.list'));
});

module.exports = router;
