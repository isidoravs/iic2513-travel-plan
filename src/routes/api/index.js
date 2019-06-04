const KoaRouter = require('koa-router');
const destinationsApi = require('./destinations');

const router = new KoaRouter();

router.use('/destinations', destinationsApi.routes());

module.exports = router;
