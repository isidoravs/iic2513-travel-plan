const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadDay(ctx, next) {
  ctx.state.day = await ctx.orm.day.findById(ctx.params.id);
  return next();
}

router.get('days.list', '/', async (ctx) => {
  const daysList = await ctx.orm.day.findAll();
  await ctx.render('days/index', {
    daysList,
    newDayPath: ctx.router.url('days.new'),
    showDayPath: day => ctx.router.url('days.show', { id: day.id }),
    editDayPath: day => ctx.router.url('days.edit', { id: day.id }),
    deleteDayPath: day => ctx.router.url('days.delete', { id: day.id }),
  });
});
router.get('days.new', '/new', async (ctx) => {
  const day = ctx.orm.day.build();
  await ctx.render('days/new', {
    day,
    submitDayPath: ctx.router.url('days.create'),
  });
});
router.get('days.edit', '/:id/edit', loadDay, async (ctx) => {
  const { day } = ctx.state;
  await ctx.render('days/edit', {
    day,
    submitDayPath: ctx.router.url('days.update', { id: day.id }),
  });
});
router.get('days.show', '/:id', loadDay, async (ctx) => {
  await ctx.render('days/show', {
    editDayPath: day => ctx.router.url('days.edit', { id: day.id }),
    deleteDayPath: day => ctx.router.url('days.delete', { id: day.id }),
  });
});
router.post('days.create', '/', async (ctx) => {
  const day = ctx.orm.day.build(ctx.request.body);
  try {
    await day.save({ fields: ['number', 'date', 'dayPicture'] });
    ctx.redirect(ctx.router.url('days.list'));
  } catch (validationError) {
    await ctx.render('days/new', {
      day,
      errors: validationError.errors,
      submitDayPath: ctx.router.url('days.create'),
    });
  }
});
router.patch('days.update', '/:id', loadDay, async (ctx) => {
  const { day } = ctx.state;
  try {
    const {
      number, date, dayPicture,
    } = ctx.request.body;
    await day.update({
      number, date, dayPicture,
    });
    ctx.redirect(ctx.router.url('days.list'));
  } catch (validationError) {
    await ctx.render('days/edit', {
      day,
      errors: validationError.errors,
      submitDayPath: ctx.router.url('days.update'),
    });
  }
});
router.del('days.delete', '/:id', loadDay, async (ctx) => {
  const { day } = ctx.state;
  await day.destroy();
  ctx.redirect(ctx.router.url('days.list'));
});
module.exports = router;
