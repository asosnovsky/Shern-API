/* Load dependencies */
var path = require('path');

/**
 * Path wrapper class
 * @param  {String} dir [folder of intrest]
 * @return {this}     
 */
module.exports = function PATH (dir) {
	
	/**
	 * Returns a file in the main directory
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	PATH.main = function(name){
		var add = [dir, '../'];
		var args = Array.prototype.slice.call(arguments);

		return path.join.apply(null, add.concat(args));
	}

	/**
	 * Returns a file location with extension
	 * @param  {String} ext  extension name (defaults to none)
	 * @return {String}      
	 */
	PATH.File = function File(specdir, ext){
		if(ext)	{ ext = '.' + ext }	else {ext = ''};
		specdir = specdir || '';
		return function(){
			var add = [specdir];
			var args = Array.prototype.slice.call(arguments);
				args[args.length - 1] += (ext);

			return PATH.main.apply(null, add.concat(args));
		}
	}
 
	/* Returns itself recursively */
	return PATH;
}