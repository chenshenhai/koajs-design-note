const fs = require('fs');
const path = require('path');
const {
  normalize,
  basename,
  extname,
  resolve,
  sep
} = path;

const defaultOpts = {
  root: '',
  maxage: '',
  immutable: false,
  hidden: false,
  extensions: false,
  brotli: false,
  gzip: false,
  setHeaders: () => {}
};

async function send(ctx, urlPath, opts = defaultOpts) {
  const { root } = opts;
  let filePath = path.join(root, urlPath);

  // step 01: normalize path
  try {
    filePath = decodeURIComponent(filePath);
  } catch (err) {
    ctx.throw(400, 'failed to decode');
  }

  // TODO: step 02: check hidden file support

  // TODO: step 03: check ext

  // step 04: stat and exist
  try {
    let exists = fs.existsSync(filePath);
    if (exists !== true) {
      ctx.body = '404 Not Found';
      return;
    }

    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      ctx.body = `${urlPath}/`;
      return;
    }
  } catch (err) {
    err.status = 500;
    throw err;
  }

  // TODO: step 05 check zip

  // step 06: stream
  ctx.type = extname(filePath);
  ctx.body = fs.createReadStream(filePath);
}

module.exports = send;
