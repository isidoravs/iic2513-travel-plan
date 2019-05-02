const KoaRouter = require('koa-router');

// disabled for testing purposes
// const sendLoginAlertEmail = require('../mailers/login-alert');

const router = new KoaRouter();

router.get('sessions.new', '/new', async ctx => ctx.render('sessions/new', {
  createSessionPath: ctx.router.url('sessions.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('sessions.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    // sendLoginAlertEmail(ctx, { user });
    ctx.session.userId = user.id;
    return ctx.redirect(ctx.router.url('itineraries.list'));
  }
  return ctx.render('sessions/new', {
    email,
    createSessionPath: ctx.router.url('sessions.create'),
    error: 'Incorrect mail or password',
  });
});

router.delete('sessions.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('sessions.new'));
});

module.exports = router;
