const compose = require('../compose');
const methods = [
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
];

class Layer {
  constructor(path, methods, middleware, opts) {
    this.path = path;
    this.methods = methods;
    this.middleware = middleware;
    this.opts = opts;
  }
}

class Router {
  constructor(opts = {}) {
    this.stack = [];

    let that = this;
  }

  register(path, methods, middleware, opts) {
    let route = new Layer(path, methods, middleware, opts);
    this.stack.push(route);
    return this;
  }

  routes() {
    console.log(this.stack);
    return async function(ctx, next) {
      await next();
    };
  }
}

methods.forEach(method => {
  Router.prototype[method.toLowerCase()] = Router.prototype[method] = function(path, middleware) {
    this.register(path, [method], middleware);
  };
});

module.exports = Router;
