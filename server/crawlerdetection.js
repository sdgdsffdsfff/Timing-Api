/*The module for crawler detection.*/
function crawlerdetection(){
	var config = require('./timing-config.json');
	var fs = require('fs');
	var url = require('url');
	var csvparse = require('csv-parse');
	var log4js = require('log4js');
	log4js.configure('./log4js-config.json', {});

	var logger = log4js.getLogger("timingAPI-logger");
	var searchEngineIPList; //cache csv file.
	var userAgentList;
	var excludePathList;
	var filename = config.crawlerDetection.searchEngineFile;
	

	function dot2num(dot) {
		var f = dot.split(':'); //for >nodejs 0.12.0 , compatible with ipV6
		var d = f[f.length-1].split('.');
		return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
	}

	function checkIP(ip) {
		var intIp = dot2num(ip);
		if(searchEngineIPList){
			for (var i = searchEngineIPList.length - 1; i >= 0; i--) {

				if(intIp>=searchEngineIPList[i][0] && intIp<=searchEngineIPList[i][1]){
					return false;
				}
			};
		}

		return true;
	}

	function checkUserAgent(userAgent){
		if(userAgentList){
			for (var i = userAgentList.length - 1; i >= 0; i--) {
				if(userAgentList[i].test(userAgent)){
					return false;
				}
			};
		}

		return true;
	}

	function checkUrl(path){
		if(excludePathList){
			var uri = url.parse(path);
			for (var i = excludePathList.length - 1; i >= 0; i--) {
				if(excludePathList[i].test(uri.pathname)){
					return false;
				}
			};
		}

		return true;
	}

	function initSearchEngineIplist(){
		var parser = csvparse({delimiter: ','}, function(err, data){
			if(err){
				logger.error(err);
			}
			else{
				searchEngineIPList = data;
			}
		});

		fs.createReadStream(__dirname + filename, {autoClose: true}).pipe(parser); 
		fs.watchFile(__dirname + filename, function (curr, prev) {
		  	fs.createReadStream(__dirname + filename, {autoClose: true}).pipe(parser); 
		});
	}

	function initUserAgentList(){
		userAgentList = [];
		if(config.userAgents){
			var userAgents = config.userAgents;
			for (var i = 0; i < userAgents.length; i++) {
				var regexp = new RegExp(userAgents[i], "i");
				regexp.compile(regexp);
				userAgentList.push(regexp);
			}
		}
	}

	function initExcludePathList(){
		excludePathList = [];
		if(config.excludePath){
			var excludePath = config.excludePath;
			for (var i = 0; i < excludePath.length; i++) {
				var regexp = new RegExp(excludePath[i], "i");
				regexp.compile(regexp);
				excludePathList.push(regexp);
			}
		}
	}

	function init(){
		try{
			initUserAgentList();
			initSearchEngineIplist();
			initExcludePathList();
		}
		catch(e){
			logger.error(e);
		}
	}


	init();

	return {
		checkCralwer: function(req){
			var ip = req.headers["X-Scource-IP"] || req.connection.remoteAddress;
			return checkUserAgent(req.headers["user-agent"]) && checkIP(ip);
		},
		checkUrl:function(req){
			var path;
			var header = req.body? req.body.header : JSON.parse(req.params.header);
			if(header){
				path = header.page;
			}
			else{
				path = req.headers["Referer"];
			}
			return path? checkUrl(path): false;
		}
	}
}

module.exports = crawlerdetection();