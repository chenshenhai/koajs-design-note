# 最简Koa.js实现

## 前言

从上一章可以看到最简单的中间件式HTTP服务的实现，底层是基于回调嵌套去处理中间件队列。

```js
  /**
   * 中间件总回调方法
   */
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
```

但是中间件越多，回调嵌套越深，代码的可读性和可扩展性就很差，所以这时候把回调嵌套转化成 `Promise` + `async/await` ，这个时候就转变成最简单的`Koa.js`实现。

## 必要条件
- 通过上下文赋值可代替 `res.end()`
- 洋葱模型的中间件机制

## 源码实现

- demo源码

[https://github.com/chenshenhai/koajs-design-note/tree/master/demo/chapter-01-07](https://github.com/chenshenhai/koajs-design-note/tree/master/demo/chapter-01-07)

- 最简Koa.js 实现

```js
const http = require('http');
const Emitter = require('events');
// 注意：这里的compose是前几章的中间件引擎源码
const compose = require('./../compose');

/**
 * 通用上下文
 */
const context = {
  _body: null,

  get body() {
    return this._body;
  },

  set body(val) {
    this._body = val;
    this.res.end(this._body);
  }
};

class SimpleKoa extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
  }

  /**
   * 服务事件监听
   * @param {*} args
   */
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * 注册使用中间件
   * @param {Function} fn
   */
  use(fn) {
    if (typeof fn === 'function') {
      this.middleware.push(fn);
    }
  }

  /**
   * 中间件总回调方法
   */
  callback() {

    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    const handleRequest = (req, res) => {
      let context = this.createContext(req, res);
      let middleware = this.middleware;
      // 执行中间件
      compose(middleware)(context).catch(err => this.onerror(err))
    };
    return handleRequest;
  }

  /**
   * 异常处理监听
   * @param {EndOfStreamError} err
   */
  onerror(err) {
    console.log(err);
  }

  /**
   * 创建通用上下文
   * @param {Object} req
   * @param {Object} res
   */
  createContext(req, res) {
    let context = Object.create(this.context);
    context.req = req;
    context.res = res;
    return context;
  }
}

module.exports = SimpleKoa;

```

- 执行例子

```js
const SimpleKoa = require('./index');

const app = new SimpleKoa();
const PORT = 3001;

app.use(async ctx => {
  ctx.body = '<p>this is a body</p>';
});

app.listen(PORT, () => {
  console.log(`the web server is starting at port ${PORT}`);
});

```
