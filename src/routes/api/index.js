const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const destinationsApi = require('./destinations');
const itinerariesApi = require('./itineraries');

const usersApi = require('./users');

const router = new KoaRouter();

router.use('/destinations', destinationsApi.routes());
router.use('/itineraries', itinerariesApi.routes());
router.use('/auth', authApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
  }
  return next();
});

// authenticated endpoints
router.use('/users', usersApi.routes());

module.exports = router;
