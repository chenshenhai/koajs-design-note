const http = require('http');
const Emitter = require('events');

class SimpleKoa extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create({});
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  use(fn) {
    if (typeof fn === 'function') {
      this.middleware.push(fn);
    }
  }

  callback() {
    let that = this;

    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    const handleRequest = (req, res) => {
      let context = that.createContext(req, res);
      this.middleware.forEach((cb, idx) => {
        try {
          cb(context);
        } catch (err) {
          that.onerror(err);
        }

        if (idx + 1 >= this.middleware.length) {
          if (res && typeof res.end === 'function') {
            res.end();
          }
        }
      });
    };
    return handleRequest;
  }

  onerror(err) {
    console.log(err);
  }

  createContext(req, res) {
    let context = Object.create(this.context);
    context.req = req;
    context.res = res;
    return context;
  }
}

module.exports = SimpleKoa;
