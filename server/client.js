//for testing server.
var restify = require('restify');
var assert = require('assert');
var client = restify.createJsonClient({
			  url: 'http://localhost:8080',
			});
//console.log(new Date().getTime());
for(var i=0;i<1;i++){
	client.get('/_.gif?header=%7B"app"%3A"WWW"%2C"page"%3A"%2F"%2C"sr"%3A"1920x1080"%2C"vp"%3A"1920x979"%2C"cacheServer"%3A""%2C"serverName"%3A"E3WEB01"%7D&traceId=CDEE5026B6564AA3BBD9AABDD6BD2B6F&category=page&data=%5B%7B"spanId"%3A"0"%2C"ns"%3A1423127511945%2C"rds"%3A0%2C"ues"%3A1423127537781%2C"uee"%3A1423127537792%2C"rde"%3A0%2C"fs"%3A1423127511945%2C"dls"%3A1423127511946%2C"dle"%3A1423127511947%2C"cs"%3A1423127511947%2C"scs"%3A0%2C"ce"%3A1423127511971%2C"rqs"%3A1423127511973%2C"rss"%3A1423127537779%2C"rse"%3A1423127537786%2C"dl"%3A1423127537813%2C"di"%3A1423127540676%2C"dcs"%3A1423127540676%2C"dce"%3A1423127540739%2C"dc"%3A1423127571414%2C"le"%3A1423127571414%2C"ls"%3A1423127571457%2C"dataType"%3A"page"%2C"source"%3A0%2C"fp"%3A26027%7D%5D&version=0.0.1', function (err, req, res, obj) {
		assert.ifError(err);
  		console.log(obj);
	});
}