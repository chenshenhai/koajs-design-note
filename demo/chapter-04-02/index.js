const {resolve} = require('path');
const send = require('./send');

function statics(opts = {
  root: ''
}) {
  opts.root = resolve(opts.root);

  // is need defer ?
  if (opts.defer !== true) {
    return async function statics(ctx, next) {
      let done = false;

      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          await send(ctx, ctx.path, opts);
          done = true;
        } catch (err) {
          if (err.status !== 404) {
            throw err;
          }
        }
      }

      if (!done) {
        await next();
      }
    };
  } else {
    return async function statics(ctx, next) {
      await next();

      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
        return;
      }

      if (ctx.body != null || ctx.status !== 404) {
        return;
      }

      try {
        await send(ctx, ctx.path, opts);
      } catch (err) {
        if (err.status !== 404) {
          throw err;
        }
      }
    };
  }
}

module.exports = statics;
