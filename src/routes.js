/* eslint-disable camelcase */
const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const itineraries = require('./routes/itineraries');
const days = require('./routes/days');
const activities = require('./routes/activities');
const reviews = require('./routes/reviews');
const destinations = require('./routes/destinations');
const sessions = require('./routes/sessions');
const api = require('./routes/api');


const router = new KoaRouter();

router.use(async (ctx, next) => {
  if (!(ctx.path === '/api/destinations')) {
    const last_path = ctx.session.path;
    ctx.session.path = ctx.path;
    ctx.session.lastPath = last_path;
    console.log('**************');
    console.log(last_path);
  }
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
    newSessionPath: ctx.router.url('sessions.new'),
    destroySessionPath: ctx.router.url('sessions.destroy'),
    itinerariesPath: ctx.router.url('itineraries.list'),
    searchPath: ctx.router.url('destinations.find'),
    bookPath: ctx.router.url('destinations.book'),
    createSessionPath: ctx.router.url('sessions.create'),
  });
  return next();
});

router.use('/api', api.routes());
router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/itineraries', itineraries.routes());
router.use('/days', days.routes());
router.use('/activities', activities.routes());
router.use('/reviews', reviews.routes());
router.use('/destinations', destinations.routes());
router.use('/sessions', sessions.routes());


module.exports = router;
