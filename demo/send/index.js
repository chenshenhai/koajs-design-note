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
  maxage: 0,
  immutable: false,
  hidden: false,
  brotli: false,
  gzip: false,
  setHeaders: () => {}
};

async function send(ctx, urlPath, opts = defaultOpts) {
  const { root, hidden, immutable, maxage, setHeaders } = opts;
  let filePath = path.join(root, urlPath);
  const fileBasename = basename(filePath);

  // step 01: normalize path
  try {
    filePath = decodeURIComponent(filePath);
  } catch (err) {
    ctx.throw(400, 'failed to decode');
  }

  // step 02: check hidden file support
  if (hidden !== true && fileBasename.startsWith('.')) {
    ctx.throw(404, '404 Not Found');
    return;
  }

  // TODO: step 03: check ext

  // step 04: stat and exist
  let stats;
  let exists;
  try {
    exists = fs.existsSync(filePath);
    if (exists !== true) {
      ctx.body = '404 Not Found';
      return;
    }

    stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      ctx.body = `${urlPath}/`;
      return;
    }
  } catch (err) {
    err.status = 500;
    throw err;
  }

  // TODO: step 05 check zip
  // TODO

  // step 06 setHeaders
  if (setHeaders) {
    setHeaders(ctx.res, filePath, stats);
  }

  ctx.set('Content-Length', stats.size);
  if (!ctx.response.get('Last-Modified')) {
    ctx.set('Last-Modified', stats.mtime.toUTCString());
  }
  if (!ctx.response.get('Cache-Control')) {
    const directives = ['max-age=' + (maxage / 1000 | 0)];
    if (immutable) {
      directives.push('immutable');
    }
    ctx.set('Cache-Control', directives.join(','));
  }
  ctx.type = extname(filePath);

  // step 07 stream
  ctx.body = fs.createReadStream(filePath);
}

module.exports = send;
