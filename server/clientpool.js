function mqclient(){
	var config = require('./timing-config.json');
	var http = require('http');
	var log4js = require('log4js');
	log4js.configure('./log4js-config.json', {});
	var logger = log4js.getLogger("timingAPI-logger");

	var clientpool = [];
	var currentClient = 0;
	var requestCount = 0;
	var keepAliveAgent = new http.Agent({minSockets: config.server.maxSockets, maxSockets: config.server.maxSockets});
	var options = {
				path: config.service.path,
				method:'POST',
				headers:{
					'Authorization': getAuthorization(),
					'Mq-version': config.service.mq_version,
					'Content-Type': 'application/json'
				},
				connectTimeout: config.service.connect_timeout,
				requestTimeout: config.service.request_timeout,
				agent: keepAliveAgent
			};

	function getHost(){
		currentClient++;
		currentClient = currentClient % config.service.hosts.length;
		return config.service.hosts[currentClient];
	}

	function getAuthorization(){
		return "Basic " + new Buffer(config.service.authorization).toString('base64');
	}


	return {
		post: function(message, topicname){
			var opt = options;
			var host = getHost();
			opt.host = host.host;
			opt.port = host.port;
			var req = http.request(opt, function(res){
				if(res.statusCode>200){
					logger.error(res.body);
				}
				res.resume();
			});
			req.on('error', function(e) { logger.error(e);});
			req.write(JSON.stringify({topic: topicname, message: message}));
			//logger.error(JSON.stringify({topic: topicname, message: message}));
			req.end();
		}
	}
}

module.exports = mqclient();