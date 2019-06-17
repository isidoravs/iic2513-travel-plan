const KoaRouter = require('koa-router');
const destinationsApi = require('./destinations');
const itinerariesApi = require('./itineraries');
const usersApi = require('./users');

const router = new KoaRouter();

router.use('/destinations', destinationsApi.routes());
router.use('/itineraries', itinerariesApi.routes());
router.use('/users', usersApi.routes());

module.exports = router;
