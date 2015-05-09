/*Dependencies*/
var fs = require('fs');

/**
 * a class that handles bower packages
 * @param  {Class} PATH [the path class]
 * @param  {Class} URL  [the URL class]
 * @return {Class}      
 */
module.exports = function BowerHandler (PATH, URL) {
	//-----------------------------------------
	//	Set folders and file types
	//-----------------------------------------
	var FILE = new PATH.File('bower_components', 'json');		
	var HOME_DIR = PATH.main('bower_components');

	//-----------------------------------------
	//	Memoization
	//-----------------------------------------
	if(!BowerHandler.dir){
		BowerHandler.dir = fs.readdirSync(HOME_DIR);
	};

	/**
	 * retrieves the json of each package
	 * @return {[type]} [description]
	 */
	BowerHandler.getMain = function() {
		if(!BowerHandler.json) {
			BowerHandler.json = {};
			BowerHandler.main = {};
			BowerHandler.dir.forEach(function(val){
				BowerHandler.json[val] = JSON.parse(
					fs.readFileSync(FILE(val, '.bower'),'utf8')
				);
				BowerHandler.main[val] = BowerHandler.json[val].main;
			});
		}
		return BowerHandler.main;
	};
	
	/**
	 * adds to a list of appropriate type (js, css)
	 * @param {Array/Number} val	[]  
	 * @param {String} key  [name of package]
	 * @param {String} type [css or js]
	 */
	BowerHandler.addTolist = function(val, key, type)	{
		if(val.constructor === Array){
			val.forEach(function(sval){
				if(sval.indexOf(type) > 0 ) {
					BowerHandler[type].push(key + '/' + sval);
				};
			});
		}	else	if(val.constructor === String)	{
			if(val.indexOf(type) > 0 ) {
				BowerHandler[type].push(key + '/' + val);
			};
		};
	};

	/**
	 * Creates a list of types
	 * @param  {String} type [js vs css]
	 * @return {Object}      [list type]
	 */
	BowerHandler.createList = function(type) {
		if(!BowerHandler[type]){
			BowerHandler[type] = [];
			var que = {};
			Object.keys(BowerHandler.getMain()).forEach(function(key){
				var val = BowerHandler.main[key];
				if(val)	{
					if(BowerHandler.json[key].dependencies)	{
						que[key] = val;
					}	else	{
						BowerHandler.addTolist(val, key, type);
					}
				}	else	{
					var indexPath = new PATH.File('bower_components', type)(key,'index');
					var indexjc = fs.existsSync(indexPath,'utf8');
					if(indexjc)	{
						BowerHandler[type].push(URL.normUrl(key, 'index.' + type));
					}	else	{
						console.warn(key, '[' + type + ']', 'was not loaded, no `main`');
					};
				}
			});
			Object.keys(que).forEach(function(key){
				BowerHandler.addTolist(que[key], key, type);
			});
		}
		return BowerHandler[type];
	};

	/**
	 * based on the type-list creates an html input
	 * @param  {String} type [js/css]
	 * @return {String}      [respective html]
	 */
	BowerHandler.createHtml = function(type) {
		if(!BowerHandler.html) {
			BowerHandler.html = {}
		};

		if(!BowerHandler.html[type]){
			BowerHandler.html[type] = '';
			BowerHandler.createList(type).forEach(function(val){
				if(type === 'css') {
					BowerHandler.html[type] += '<link rel="stylesheet" href="' + URL.cnstUrl('bower_components', val) + '"/>'
				}	else if(type === 'js')	{
					BowerHandler.html[type] += '<script src="' + URL.cnstUrl('bower_components', val) + '"></script>'
				}
			});
		};

		return BowerHandler.html[type];
	};
	return BowerHandler;
}

