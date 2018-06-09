const mount = require('./index');
const Koa = require('koa')

async function app1 (ctx, next) {
  await next()
  ctx.body = 'app 1'
}

async function app2 (ctx, next) {
  await next()
  ctx.body = 'app 2'
}

const app = new Koa()

app.use(mount('/app1', app1))
app.use(mount('/app2', app2))

app.listen(3000)
