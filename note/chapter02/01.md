# AOP 面向切面编程

## 什么是AOP?

什么是AOP？中文意思是面向切面编程，听起来感觉很模糊。先举个生产的例子。

- 农场的水果包装流水线一开始只有 `采摘 - 清洗 - 贴标签`

![example](https://user-images.githubusercontent.com/8216630/42586566-0014a912-856b-11e8-8e96-6aa54db8f60c.png)

- 为了提高销量，想加上两道工序 `分类` 和 `包装` 但又不能干扰原有的流程，同时如果没增加收益可以随时撤销新增工序。

![example](https://user-images.githubusercontent.com/8216630/42586569-0113afe8-856b-11e8-9580-4238053ddc60.png)

- 最后在流水线的中的空隙插上两个工人去处理，形成`采摘 - 分类 - 清洗 - 包装 - 贴标签` 的新流程，而且工人可以随时撤回。

回到什么是AOP？就是在现有代码程序中，在程序生命周期或者横向流程中 `加入/减去` 一个或多个功能，不影响原有功能。


## Koa.js 的切面

- 切面由中间件机制实现
- 一个中间件一般有两个切面
- 遵循先进后出的切面执行顺序，类似入栈出栈的顺序

![example](https://user-images.githubusercontent.com/8216630/42587672-084c4402-856e-11e8-8fb4-dde31009baad.png)


## 参考文章

- [Intro to Aspect Oriented Programming](http://know.cujojs.com/tutorials/aop/intro-to-aspect-oriented-programming)
- [面向切面编程（AOP）简介](http://bubkoo.com/2014/05/08/intro-to-aspect-oriented-programming/)
- [用AOP改善javascript代码](http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/)

