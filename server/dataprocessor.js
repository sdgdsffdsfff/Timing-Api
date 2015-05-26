function dataprocessor(){
	var dataVersion = "0.0.1";
	var chianHash = require('./chainhash');
	var pagemapping = require('./pagemapping'); 
	var log4js = require('log4js');
	log4js.configure('log4js-config.json', {});
	var logger = log4js.getLogger("timingAPI-logger");

	function formatGetData(req){
		var data = {};
		try{
			data.traceId = req.params.traceId;
			data.header = JSON.parse(req.params.header);
			data.data = JSON.parse(req.params.data);
			data = formatHeaderData(data, req);
			data = trasformData(data);
		}
		catch(e){
			logger.error(e);
			return null;
		}
		return data;
	}

	function formatPostData(req){
		var data = req.body;
		try{
			data = formatHeaderData(data, req);
			trasformData(data);
		}
		catch(e){
			logger.error(e);
			return null;
		}

		return data;
	}

	function formatHeaderData(data, req){
		data.header.useragent = req.headers["user-agent"];
		if(!data.header.page){
			var uri = url.parse(req.headers["Referer"]);
			data.header.page = uri.pathname;
		}
		data.header.page = pagemapping.mapping(data);
		return data;
	}

	function trasformData(data){
		var entrySign = chianHash.hashCode(data.header.page);
		var spans = data.data;
		for (var i = 0; i < spans.length; i++) {
			var spandata = spans[i];
			spandata.entrySign = entrySign;
			spandata.spanSign = spandata.name ? chianHash.hashCode(spandata.name, entrySign): entrySign;
			if(spandata.spanId!="0"){
				spans[i] = absoluteTime(spandata);
			}
		};
		data.version = dataVersion;
		//console.log(data);
		return data;
	}

	var properties=["st","rds","rde","fs","dls","dle","cs","scs","ce","rqs","rss","rse"];
	function absoluteTime(spanData){
		for (var i = properties.length - 1; i >= 0; i--) {
			var propertyname = properties[i];
			var time = spanData[propertyname];
			if(time > 0){
				spanData[propertyname] = (time + spanData.ns).toFixed();
			}
		};
		return spanData;
	}

	return {
		formatData: function(req){
			return req.method == 'GET'? formatGetData(req): formatPostData(req);
		}
	}
}

module.exports = dataprocessor();