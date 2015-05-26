Welcome to TimingAPI
===================
这个Project的目的是收集浏览器端Page Speed数据到后端，以便分析数据，对UI优化提供依据。

----------

Server Side
-------------
Server Side使用**NodeJs**进行开发，请安装**NodeJs 0.10.0**以上，开发依赖以下开源模块：

**node-restify**: 这是一个Restful API框架，实现Restful风格的Server端和Client端。
[https://github.com/mcavage/node-restify]
```
npm install restify
```
**log4js-node**: Log4系列的Nodejs实现，支持文件和邮件等多种Appender, 支持不同的Level , Category写入不同的Appender。
[https://github.com/nomiddlename/log4js-node]
```
npm install log4js
```
**bn.js**: 用于高精度数据计算，在生成SpanSign的时候会使用h(B)*31+hd的算法，涉及到高精度运算。
[https://github.com/indutny/bn.js]
```
npm install bn.js
```
**csv-parse**: 这里只用了CSV for NodeJs的解析器部分，用于解析CSV文件为数组。
[https://github.com/wdavidw/node-csv-parse]
```
npm install csv-parse
```

#### <i class="icon-pencil"></i> Configration

**timing-config.json** 主配置文件：
> - **server.port**: API service启动端口
> - **server.schedulingPolicy**: 配置Cluster worker的工作分配模式，有**round-robin**和**none**两种模式，“none”模式下，由OS随机分配worker,“round-robin”模式下有cluster master轮询分配worker。目前只有node js **v0.12.0**以上才支持round-robin
> - **server.maxWorkerCrashes**: Cluster worker发生Crash的最大次数，小于这个数时，cluster master会在worker crash时自动fork一个新的worker，crash次数超过这个数后会退出整个主程序。
> - **server.maxSockets**: 向MQ Service些数据时最多可以打开多少Socket, 这个数字会影响程序的数据发送速度，程序的内存占用和数据的发送成功率。
> - **service**: section配置了消息写入那个service
> - **crawlerDetection**: 配置搜索引擎爬虫数据库的文件名
> - **excludePath**: 配置了需要排除记录的url，可配置正则表达式
> - **userAgents**: 配置了需要排除记录的userAgent, 针对不同的爬虫特征，配置不同的正则表达式

```
{
    "server":{
		"port":8080,
		"schedulingPolicy":"round-robin",
		"maxWorkerCrashes": 10,
		"maxSockets": 100
	},
	"service":{
		"hosts":[
			"http://10.16.40.35:9999",
			"http://10.16.40.35:9999"
		],
		"path":"/ECMQ/sendMessage",
		"authorization":"rocketmq:rocketmq",
		"mq_version": "1",
		"connect_timout": 500,
		"request_timout": 2000,
		"topic_name": "TimingAPI"
	},
	"crawlerDetection":{
		"searchEngineFile": "/searchengine.csv"
	},
	"excludePath":[
		"/app/faq.*"
	],
	"userAgents":[
		"Googlebot",
		"Googlebot",
		"Bingbot"
	]
}
```

**log4j-config.json** 配置文件, 配置log的写入，请参考https://github.com/nomiddlename/log4js-node：

```
{
  "appenders":[
    {
      "type":"file",
      "filename":"timingAPI.log",
      "maxLogSize":20480,
      "backups":10,
      "category":"timingAPI-logger"
    }
  ]
}
```

**PageMapping** 配置文件, 放置在pagemapping文件夹下，以“AppName”+".json"命名, 对应不用的App, 这里的App是前途传入数据中的Header的app属性的值。
这里的配置为K-V模式，Key为需要显示的友页面名称，Value为页面对应路径的正则表达式。 如果在这个配置中找不到对应的页面，则在会使用原始路径作为header中的page属性的值。
关于header的说明请参见客户端文档。

```
{
	"Homepage": "^(/Index\\.aspx)|/$",
	"GlobalHomePage": "^/Global-Home\\.aspx$",
	"GlobalCampaignDetail": "^/Global/CampaignDetail\\.aspx$",
	"GlobalCampaignListing": "^/Global/CampaignListing\\.aspx$",
	"DailyDeal": "^/DailyDeal\\.aspx$",
	"ProductDetail": "^/Product/Product\\.aspx$",
	"IBuyPower": "^/Product/IBuyPower\\.aspx$",
	"PointOfSale": "^/Product/PointOfSale\\.aspx$",
	"TabStore": "^(/store/TabStore\\.aspx)|(/.+?/store/.*)$",
	"Subcategory": "^(/store/Subcategory\\.aspx)|(/.+?/Subcategory/.*)$",
	"Category": "^(/store/Category\\.aspx)|(/.+?/Category/.*)$"
}
```

> **Note**
> - 配置文件请严格遵守JSON文件格式，不支持注释"//"。
> - 字段名必须使用双引号"包围。
> - {},[]最后元素不要跟","。

#### <i class="icon-pencil"></i> **Usage**

 1. Health Checker Path："/faq"，返回“OK”，即为可用。
 2. Restful Path：“/_.gif”，使用GET和POST方式发送数据, 数据格式参见Client的README.md。