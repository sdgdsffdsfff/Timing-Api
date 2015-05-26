/*Load page mapping data , get page name by url*/
function pagemapping(){

	var log4js = require('log4js');
	var fs = require('fs');
	log4js.configure('./log4js-config.json', {});
	var logger = log4js.getLogger("timingAPI-logger");
	var mappingpath = "./pagemapping/";
	var mappings = {};

	function init(){
		loadDir();
		fs.watch(mappingpath, function (event, filename) {
			if (filename) {
				loadData(filename);
			}
		});
	}

	function loadData(filename){
		try{
			var data = fs.readFileSync(mappingpath + filename);
			if(data){
				var mappingdata = JSON.parse(data);
				for (var key in mappingdata){
					var regexp = new RegExp(mappingdata[key], "i");
					regexp.compile(regexp);
					mappingdata[key] = regexp;
				}
				mappings[filename] = mappingdata;
			}
		}
		catch(err){
			logger.error(err);
		}
	}

	function loadDir(){
		var files = fs.readdirSync(mappingpath);
		for (var i = files.length - 1; i >= 0; i--) {
			loadData(files[i]);
		};
	}

	init();

	return {
		mapping: function(data){
			var filename = data.header.app + ".json";
			var mappingdata = mappings[filename];
			for (var key in mappingdata){
				if(mappingdata[key].test(data.header.page)){
					return key;
				}
			}

			return data.header.page;
		}
	}
}

module.exports = pagemapping();