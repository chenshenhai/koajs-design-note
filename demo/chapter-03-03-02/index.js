const Koa = require('koa');
let app = new Koa();

function indirectMiddleware(path, middleware) {
  return async function(ctx, next) {
    if ( ctx.path === path ) {
      await middleware(ctx, next)
    }
  }
}

const index = async function ( ctx, next ) {
  ctx.body = 'this is index page';
  await next();
}

const hello = async function ( ctx, next ) {
  ctx.body = 'this is hello page';
  await next();
}

const world = async function ( ctx, next ) {
  ctx.body = 'this is world page';
  await next();
}

app.use( indirectMiddleware( '/', index ) );
app.use( indirectMiddleware( '/hello', hello ) );
app.use( indirectMiddleware( '/world', world ) );

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})