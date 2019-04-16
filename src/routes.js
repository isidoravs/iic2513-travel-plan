const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const itineraries = require('./routes/itineraries');
const days = require('./routes/days');
const activities = require('./routes/activities');
const reviews = require('./routes/reviews');
const destinations = require('./routes/destinations');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/itineraries', itineraries.routes());
router.use('/days', days.routes());
router.use('/activities', activities.routes());
router.use('/reviews', reviews.routes());
router.use('/destinations', destinations.routes());


module.exports = router;
