# Node.js原生http模块

## 前言

Koa.js 是基于中间件模式的HTTP服务框架，底层原理是离不开Node.js的`http` 原生模块。

## http模块使用

```js
const http = require('http');
const PORT = 3001;
const router = (req, res) => {
  res.end(`this page url = ${req.url}`);
}
const server = http.createServer(router)
server.listen(PORT, function() {
  console.log(`the server is started at port ${PORT}`)
})
```

## http服务构成

### 服务容器

这里的服务容器，是整个HTTP服务的基石，跟`apache`和`nginx`提供的能力是一致的。

- 建立了通信连接
- 指定了通信端口
- 提供了可自定内容服务容器，也就是服务的回调函数的容器

```js
const http = require('http');
const PORT = 3001;
const server = http.createServer((req, res) => {
    // TODO 容器内容
    // TODO 服务回调内容
})
server.listen(PORT, function() {
  console.log(`the server is started at port ${PORT}`)
})
```

### 服务回调 (内容)
服务回调，可以理解成服务内容，主要提供服务的功能。
- 解析服务的请求 `req`
- 对请求内容作出响应 `res`

```js
const router = (req, res) => {
  res.end(`this page url = ${req.url}`);
}
```

### 请求 req

是服务回调中的第一个参数，主要是提供了HTTP请求`request`的内容和操作内容的方法。

更多操作建议查看 Node.js官方文档

[https://nodejs.org/dist/latest-v8.x/docs/api/http.html](https://nodejs.org/dist/latest-v8.x/docs/api/http.html)

[https://nodejs.org/dist/latest-v10.x/docs/api/http.html](https://nodejs.org/dist/latest-v10.x/docs/api/http.html)


### 响应 res

是服务回调中的第二个参数，主要是提供了HTTP响应`response`的内容和操作内容的方法。

注意：如果请求结束，一定要执行响应 `res.end()`，要不然请求会一直等待阻塞，直至连接断掉页面崩溃。


更多操作建议查看 Node.js官方文档

[https://nodejs.org/dist/latest-v8.x/docs/api/http.html](https://nodejs.org/dist/latest-v8.x/docs/api/http.html)


[https://nodejs.org/dist/latest-v10.x/docs/api/http.html](https://nodejs.org/dist/latest-v10.x/docs/api/http.html)


## 后续

通过以上的描述，主要HTTP服务内容是在 “`服务回调`” 中处理的，那我们来根据不同连接拆分一下，就形成了路由`router`，根据路由内容的拆分，就形成了控制器 `controller`。参考代码如下。

```js
const http = require('http');
const PORT = 3001;

// 控制器
const controller = {
  index(req, res) {
    res.end('This is index page')
  },
  home(req, res) {
    res.end('This is home page')
  },
  _404(req, res) {
    res.end('404 Not Found')
  }
}

// 路由器
const router = (req, res) => {
  if( req.url === '/' ) {
    controller.index(req, res)
  } else if( req.url.startsWith('/home') ) {
    controller.home(req, res)
  } else {
    controller._404(req, res)
  }
}

// 服务
const server = http.createServer(router)
server.listen(PORT, function() {
  console.log(`the server is started at port ${PORT}`)
})
```