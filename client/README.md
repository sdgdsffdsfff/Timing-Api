Welcome to neg-trace!
===================

neg-trace.js 是Timing API 的 前端框架，负责收据前端统计数据（性能等）

----------

目录结构
-------------
* 01_Lib：neg-trace lib 库 

* 02_gulp：一些lib的配置文件，以及制定各种自定义的lib 

* 03_newegg-ec：给ec 用的build 好的类库 

类库使用
-------------
* 引入neg-trace.js
```
<script type="text/javascript" src="neg-trace.js"></script>
```

插件规格说明
-------------
* neg-trace("send", "page");
     * 简介：发送页面指标数据
     * 参数介绍：

    header 结构说明：
    
    | 传递参数 | 说明 |
	| ----- | ---- |
	| APP   | Newegg 各application id，如WWW，Mobile|
	| page | pageName |
	| serverName | wbe server name|
	| sr | screen |
	| vp | viewpoint|
	| cacheServer | cache server|

    data结构说明：
 
	| 传递参数 | 浏览器指标 |说明 |
	| ----- | ---- |---- |
	|	ns	|	navigationStart	|	表示浏览器指示卸载旧页面时间点	|
    |	rds	|	redirectStart	|	浏览器开始执行redirect操作	|
    |	ues	|	unloadEventStart	|	旧页面unload事件被触发的时间点	|
    |	uee	|	unloadEventEnd	|	旧页面unload事件处理完成的时间点	|
    |	rde	|	redirectEnd	|	浏览器结束redirect操作	|
    |	fs	|	fetchStart	|	开始获取请求的页面，首先会在AppCache中查找	|
    |	dls	|	domainLookupStart	|	DNS查找操作开始	|
    |	dle	|	domainLookupEnd	|	DNS查找操作结束	|
    |	cs	|	connectStart	|	发起Http连接请求	|
    |	scs	|	secureConnectionStart	|	开始建立https连接	|
    |	ce	|	connectEnd	|	建立Http链接成功	|
    |	rqs	|	requestStart	|	开始发送Request	|
    |	rss	|	responseStart	|	开始接收返回数据	|
    |	rse	|	responseEnd 	|	返回数据接收完成	|
    |	dl	|	domLoading	|	Dom开始载入，解析dom	|
    |	di	|	domInteractive	|	Dom元素允许交互操作	|
    |	dcs	|	domContentLoadedEventStart	|	Dom结构完备,Dom ready事件触发	|
    |	dce	|	domContentLoadedEventEnd	|	Dom ready事件处理完毕	|
    |	dc	|	domComplete	|	页面元素load完成	|
    |	ls	|	loadEventStart	|	pageload事件触发	|
    |	le	|	loadEventEnd	|	pageload事件处理完毕	|
    |	fp	|	firstPain	|	页面首屏加载时间	|

    
    截图如下：
    
    ![image](http://trgit2/rj83/timingapi/raw/master/client/04_doc/image/page.png)


* neg-trace("send", "resource");
     * 简介：发送资源指标数据
     * 参数介绍：

    header 结构说明：
    
    | 传递参数 | 说明 |
	| ----- | ---- |
	| APP   | Newegg 各application id，如WWW，Mobile|
	| page | pageName |
	| serverName | wbe server name|
	| sr | screen |
	| vp | viewpoint|
	| cacheServer | cache server|
	
	data结构说明：
 
	| 传递参数 | 浏览器指标 |说明 |
	| ----- | ---- |---- |
	|	st	|	startTime	|	资源被页面请求调用的时间	|
    |	rds	|	redirectStart	|	浏览器开始执行redirect操作	|
    |	rde	|	redirectEnd	|	浏览器结束redirect操作	|
    |	fs	|	fetchStart	|	开始获取请求资源，首先会在AppCache中查找	|
    |	dls	|	domainLookupStart	|	DNS查找操作开始	|
    |	dle	|	domainLookupEnd	|	DNS查找操作结束	|
    |	cs	|	connectStart	|	发起Http连接请求	|
    |	scs	|	secureConnectionStart	|	开始建立https连接	|
    |	ce	|	connectEnd	|	建立Http链接成功	|
    |	rqs	|	requestStart	|	开始发送Request	|
    |	rss	|	responseStart	|	开始接收返回数据	|
    |	rse	|	responseEnd 	|	返回数据接收完成	|
    
    截图如下：
    
    ![image](http://trgit2/rj83/timingapi/raw/master/client/04_doc/image/resource.png)

	