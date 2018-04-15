const send = require('./src/send');
const Koa = require('koa');
const app = new Koa();

// $ GET /package.json
// $ GET /

app.use(async ctx => {
  await send(ctx, ctx.path, { root: `${__dirname}/public` });
});

app.listen(3000);
console.log('listening on port 3000');
