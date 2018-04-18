const fs = require('fs');
const path = require('path');
const {
  basename,
  extname
} = path;

const defaultOpts = {
  root: '',
  maxage: 0,
  immutable: false,
  extensions: false,
  hidden: false,
  brotli: false,
  gzip: false,
  setHeaders: () => {}
};

async function send(ctx, urlPath, opts = defaultOpts) {
  const { root, hidden, immutable, maxage, brotli, gzip, setHeaders } = opts;
  let filePath = urlPath;

  // step 01: normalize path
  try {
    filePath = decodeURIComponent(filePath);
    // check legal path
    if (/[\.]{2,}/ig.test(filePath)) {
      ctx.throw(403, 'Forbidden');
    }
  } catch (err) {
    ctx.throw(400, 'failed to decode');
  }

  filePath = path.join(root, urlPath);
  const fileBasename = basename(filePath);

  // step 02: check hidden file support
  if (hidden !== true && fileBasename.startsWith('.')) {
    ctx.throw(404, '404 Not Found');
    return;
  }

  // step 03: stat
  let stats; 
  try { 
    stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      ctx.throw(404, '404 Not Found');
    }
  } catch (err) {
    const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']
    if (notfound.includes(err.code)) {
      ctx.throw(404, '404 Not Found');
      return;
    }
    err.status = 500
    throw err
  }

  let encodingExt = '';
  // step 04 check zip
  if (ctx.acceptsEncodings('br', 'identity') === 'br' && brotli && (fs.existsSync(filePath + '.br'))) {
    filePath = filePath + '.br';
    ctx.set('Content-Encoding', 'br');
    ctx.res.removeHeader('Content-Length');
    encodingExt = '.br';
  } else if (ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && gzip && (fs.existsSync(filePath + '.gz'))) {
    filePath = filePath + '.gz';
    ctx.set('Content-Encoding', 'gzip');
    ctx.res.removeHeader('Content-Length');
    encodingExt = '.gz';
  }

  // step 05 setHeaders
  if (typeof setHeaders === 'function') {
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

  const ctxType = encodingExt !== '' ? extname(basename(filePath, encodingExt)) : extname(filePath);
  ctx.type = ctxType;

  // step 06 stream
  ctx.body = fs.createReadStream(filePath);
}

module.exports = send;
