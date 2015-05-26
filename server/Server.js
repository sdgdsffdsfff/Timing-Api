var cluster = require('cluster');
var compareVersion = require('./compare-version');
var timingConfig = require("./timing-config.json");

if(compareVersion(process.version, '0.12.0') >= 0){
	cluster.schedulingPolicy = timingConfig.server.schedulingPolicy == "round-robin"? cluster.SCHED_RR: cluster.SCHED_NONE;
}
// Code to run if we're in the master process
if (cluster.isMaster) {

	console.log("master start...");
  	// Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    //cpuCount = 1; //for debuger

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i ++) {
        cluster.fork();
    }

    cluster.on('listening', function(worker, address){
        console.log('listening: worker ' + worker.process.pid);
    });

    var maxWorkerCrashes = timingConfig.server.maxWorkerCrashes;
    cluster.on('exit', function (worker, code, signal) {
    	if (worker.suicide !== true) {
	        maxWorkerCrashes--;
	        if (maxWorkerCrashes <= 0) {
	            console.error('Too many worker crashes');
	            // kill the cluster, let supervisor restart it
	            process.exit(1);
	        } else {
	        	console.log('Worker ' + worker.id + ' died :(');
	            cluster.fork();
	        }
	    }
	});

// Code to run if we're in a worker process
} else if (cluster.isWorker) {
	var restify = require('restify');
	var log4js = require('log4js');
	log4js.configure('./log4js-config.json', {});

	var crawlerdetection = require('./crawlerdetection');
	var client = require('./clientpool');
	var dataprocessor = require('./dataprocessor');
	
	var logger = log4js.getLogger("timingAPI-logger");

	var server = restify.createServer({
	  name: 'TimingAPI',
	  version: '0.1.0',
	});

	/*Check IP, block search engin crawler*/
	server.use(function(req, res, next){   
		if(crawlerdetection.checkCralwer(req)){
			return next();
		}
		else{
			res.send(403, 'Access is denied.');
			res.end();
		}
	});
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());

	/*Accept data, and forward to MQ.*/
	server.get('/_.gif', function (req, res, next) {
		dealdata(req, res, timingConfig.service.page_topic_name);
		res.end();
		return next();
	});

	server.post('/_.gif', function (req, res, next) {
		dealdata(req, res, timingConfig.service.resource_topic_name);
		return next();
	});

	/*Health Checker.*/
	server.get('/faq', function (req, res, next) {
		res.send('OK');
		res.end();
		return next();
	});

	server.listen(timingConfig.server.port, function () {
		console.log('%s listening at %s', server.name, server.url);
	});

	function dealdata(req, res, topicname){
		res.header('Access-Control-Allow-Origin','*');
		try{
			if(crawlerdetection.checkUrl(req)){
				var data = dataprocessor.formatData(req);
				if(data != null){
					client.post(JSON.stringify(data), topicname);
				}
			}
		}
		catch(err){
			logger.error(err);
			res.send(500, 'Internal server error.');
		}
		//console.log('Worker ' + cluster.worker.id + ' is running!');
		res.end();
	}
}