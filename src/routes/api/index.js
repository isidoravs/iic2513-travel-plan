const KoaRouter = require('koa-router');
const destinationsApi = require('./destinations');
const itinerariesApi = require('./itineraries');


const router = new KoaRouter();

router.use('/destinations', destinationsApi.routes());
router.use('/itineraries', itinerariesApi.routes());

module.exports = router;
