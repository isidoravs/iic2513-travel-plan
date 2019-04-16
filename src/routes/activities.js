const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadActivity(ctx, next) {
  ctx.state.activity = await ctx.orm.activity.findById(ctx.params.id);
  return next();
}

router.get('activities.list', '/', async (ctx) => {
  const activitiesList = await ctx.orm.activity.findAll();
  await ctx.render('activities/index', {
    activitiesList,
    newActivityPath: ctx.router.url('activities.new'),
    showActivityPath: activity => ctx.router.url('activities.show', { id: activity.id }),
    editActivityPath: activity => ctx.router.url('activities.edit', { id: activity.id }),
    deleteActivityPath: activity => ctx.router.url('activities.delete', { id: activity.id }),
  });
});
router.get('activities.new', '/new', async (ctx) => {
  const activity = ctx.orm.activity.build();
  await ctx.render('activities/new', {
    activity,
    submitActivityPath: ctx.router.url('activities.create'),
  });
});
router.get('activities.edit', '/:id/edit', loadActivity, async (ctx) => {
  const { activity } = ctx.state;
  await ctx.render('activities/edit', {
    activity,
    submitActivityPath: ctx.router.url('activities.update', { id: activity.id }),
  });
});
router.get('activities.show', '/:id', loadActivity, async (ctx) => {
  await ctx.render('activities/show', {
    editActivityPath: activity => ctx.router.url('activity.edit', { id: activity.id }),
    deleteActivityPath: activity => ctx.router.url('activity.delete', { id: activity.id }),
  });
});
router.post('activities.create', '/', async (ctx) => {
  const activity = ctx.orm.activity.build(ctx.request.body);
  try {
    await activity.save({ fields: ['title', 'activityPictue', 'description'] });
    ctx.redirect(ctx.router.url('activities.list'));
  } catch (validationError) {
    await ctx.render('activities/new', {
      activity,
      errors: validationError.errors,
      submitActivityPath: ctx.router.url('activities.create'),
    });
  }
});
router.patch('activities.update', '/:id', loadActivity, async (ctx) => {
  const { activity } = ctx.state;
  try {
    const {
      title, activityPicture, description,
    } = ctx.request.body;
    await activity.update({
      title, activityPicture, description,
    });
    ctx.redirect(ctx.router.url('activities.list'));
  } catch (validationError) {
    await ctx.render('activities/edit', {
      activity,
      errors: validationError.errors,
      submitActivityPath: ctx.router.url('activities.update'),
    });
  }
});
router.del('activities.delete', '/:id', loadActivity, async (ctx) => {
  const { activity } = ctx.state;
  await activity.destroy();
  ctx.redirect(ctx.router.url('activities.list'));
});
module.exports = router;
