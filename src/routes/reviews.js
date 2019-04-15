const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findById(ctx.params.id);
  return next();
}

router.get('reviews.list', '/', async (ctx) => {
  const reviewsList = await ctx.orm.review.findAll();
  await ctx.render('reviews/index', {
    reviewsList,
    newReviewPath: ctx.router.url('reviews.new'),
    showReviewPath: review => ctx.router.url('reviews.show', { id: review.id }),
    editReviewPath: review => ctx.router.url('reviews.edit', { id: review.id }),
    deleteReviewPath: review => ctx.router.url('reviews.delete', { id: review.id }),
  });
});

router.get('reviews.new', '/new', async (ctx) => {
  const review = ctx.orm.review.build();
  await ctx.render('reviews/new', {
    review,
    submitReviewPath: ctx.router.url('reviews.create'),
  });
});
router.get('reviews.edit', '/:id/edit', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await ctx.render('reviews/edit', {
    review,
    submitReviewPath: ctx.router.url('reviews.update', { id: review.id }),
  });
});
router.get('reviews.show', '/:id', loadReview, async (ctx) => {
  await ctx.render('reviews/show', {
    editReviewPath: review => ctx.router.url('reviews.edit', { id: review.id }),
    deleteReviewPath: review => ctx.router.url('reviews.delete', { id: review.id }),
  });
});
router.post('reviews.create', '/', async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  try {
    await review.save({ fields: ['reviewname', 'email', 'password'] });
    ctx.redirect(ctx.router.url('reviews.list'));
    const score = 0;
    await review.update({ score });
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.create'),
    });
  }
});
router.patch('reviews.update', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  try {
    const {
      reviewname, email, password, birthDate, gender, country, publicName, photo,
    } = ctx.request.body;
    await review.update({
      reviewname, email, password, birthDate, gender, country, publicName, photo,
    });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.update'),
    });
  }
});
router.del('reviews.delete', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('reviews.list'));
});
module.exports = router;
