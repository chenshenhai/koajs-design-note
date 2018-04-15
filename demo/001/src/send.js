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

async function send(ctx, filePath, opts = defaultOpts) {
  const {
    root
  } = opts;

  // step 01: normalize path
  try {
    filePath = decodeURIComponent(filePath);
  } catch (err) {
    ctx.throw(400, 'failed to decode');
  }
  filePath = path.join(root, filePath);

  // TODO: step 02: check hidden file support

  // TODO: step 03: check ext

  // step 04: stat
  let stat = fs.statSync(filePath);
  console.log('xxxx', extname(filePath));
  // TODO: step 05 check zip

  // step 06: stream
  ctx.type = extname(filePath);
  ctx.body = fs.createReadStream(filePath);
}

module.exports = send;
