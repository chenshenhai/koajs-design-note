# Koa.js 设计模式-学习笔记

## 前言

之前写过一本《Koa2进阶学习笔记》作为Koa的入门教程。很多知识点都是一笔带过，没有深入的讲解。这一本书是通过Koa.js的常用中间件实现原理，举一反三来讲解一些Node.js在Web开发过程中的原理和设计模式。


Koa.js 是一个极其精简的Web框架，只提供一下两种功能：

- HTTP服务
    - 处理HTTP请求request
    - 处理HTTP响应response
- 中间件容器
    - 中间件的加载
    - 中间件的执行

剩下的其他Web服务所需的能力，就根据开发者的需求去自定义开发，留下了很大的灵活空间，提高了Web服务的开发成本。在我的理解中，Koa.js的灵活度带来的开发成本有以下两种：

- 框架的设计
- 中间件的选择

框架的设计，这一因素比较复杂，后续会新开一本书讲解。本书主要是解析常用的Koa.js中间件，抽象出相关中间件的功能原理和实现方式，用demo让读者理解原理，减少对官方源码的依赖，尽量达到“授人予渔”。


## 关于本书

- [关于作者(我)](https://chenshenhai.github.io/)
- [gitbook在线阅读入口](https://chenshenhai.github.io/koajs-design-note/)
- 如有错误或疑问欢迎，提交[issues](https://github.com/chenshenhai/koajs-design-note/issues)或PR


## 目录

![koajs-design-note mini](https://user-images.githubusercontent.com/8216630/42525467-ceea9f42-84a5-11e8-9f3f-9ce358952a51.png)


* 1. Koa.js 原理
    * [1.1 学习准备](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/01.md)   
    * [1.2 Promise 使用](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/02.md)
    * [1.3 async/await 使用](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/03.md)
    * [1.4 Node.js原生http模块](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/04.md)
    * [1.5 中间件引擎](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/05.md)
    * [1.6 普通中间件式HTTP服务实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/06.md)
    * [1.7 最简Koa.js实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter01/07.md)
* 2. Koa.js 的AOP设计
    * [2.1 AOP面向切面编程](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter02/01.md)
    * [2.2 洋葱模型切面](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter02/02.md)
    * [2.3 HTTP切面流程](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter02/03.md)
* 3. Koa.js 中间件
    * [3.1 中间件分类](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter03/01.md)
    * [3.2 狭义中间件](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter03/02.md)
    * [3.3 广义中间件](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter03/03.md)
* 4. 狭义中间件-请求/响应拦截
    * [4.1 koa-logger 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter04/01.md)
    * [4.2 koa-send 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter04/02.md)
    * [4.3 koa-static 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter04/03.md)
* 5. 狭义中间件-context代理
    * [5.1 koa-view 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter05/01.md)
    * [5.2 koa-jsonp 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter05/02.md)
    * [5.3 koa-bodyparser 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter05/03.md)
* 6. 广义中间件-间接中间件处理
    * [6.1 koa-router 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter06/01.md)
    * [6.2 koa-mount 实现](https://github.com/chenshenhai/koajs-design-note/tree/master/note/chapter06/02.md)
    











