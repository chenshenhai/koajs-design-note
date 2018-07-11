# 普通中间件式HTTP服务实现

## 前言

用过`Express.js`和`Koa.js`的人会发现使用方式很类似，也是基于`中间件`的理念去实现Web服务。

直接以`Express.js`回调式的中间件服务比较容易理解。再基于回调式的中间件服务接入`Koa.js`的中间件引擎去处理回调嵌套的处理。

这一章主要以原生的Node.js实现纯回调的中间件HTTP服务。

## 必要条件

- 内置中间件队列
- 中间件遍历机制
- 异常处理机制

## 最简实现

- demo源码 


[https://github.com/chenshenhai/koajs-design-note/tree/master/demo/chapter-01-06](https://github.com/chenshenhai/koajs-design-note/tree/master/demo/chapter-01-06)

- 服务类封装

```js
const http = require('http');
const Emitter = require('events');

class WebServer extends Emitter {
  
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create({});
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

module.exports = WebServer;

```

- 服务使用

```js
const WebServer = require('./index');

const app = new WebServer();
const PORT = 3001;

app.use(ctx => {
  ctx.res.write('<p>line 1</p>');
});

app.use(ctx => {
  ctx.res.write('<p>line 2</p>');
});

app.use(ctx => {
  ctx.res.write('<p>line 3</p>');
});

app.listen(PORT, () => {
  console.log(`the web server is starting at port ${PORT}`);
});

```
