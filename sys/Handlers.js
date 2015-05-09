/* Load dependencies */
var fs 	= require('fs');

/**
 * Loads all handlers
 * @param  {Class} PATH 
 * @param  {Class} URL  
 * @param  {Class} BASE 
 * @param  {Class} DOCS 
 * @return {Class}      
 */
module.exports = function Handler (PATH, URL, BASE, DOCS) {
	/* Load directory */
	var DIRNAME = PATH.main('handlers');
	var FILE 	= PATH.File('handlers');
		Handler.dir = Handler.dir || fs.readdirSync(DIRNAME);

	console.log('[Loading Handlers...]');
	var Handlers = {};
	Handler.dir.forEach(function(val){
		if(val.indexOf('.js') === val.length - 3){
			console.log('> ' + val.substr(0,val.length - 3));
			Handlers[val.substr(0,val.length - 3)] = require(FILE(val))(PATH, URL, BASE, DOCS);

		}	else	{
			console.warn('improper file extension: `sys/Handlers/' + val + '`');
		};
	});

	console.log('[Handlers Done!]');

	return Handlers;
}