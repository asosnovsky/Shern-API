/*Dependencies*/
var rio 	= require('rio'),
	fs		= require('fs');

/**
 * R instace handler (Shuxuejia means Mathematician)
 * @param  {Class} PATH 
 * @param  {Class} URL  
 * @return {Class}      [returns the Shuxuejia class]
 */
module.exports = function (PATH, URL) {
	//-----------------------------------------
	//	Load appropriate file types
	//-----------------------------------------
	var FILE = new PATH.File('r', 'r');	
	/**
	 * External definition, loads a particular file
	 * @param {String} filename   
	 * @param {String} entryPoint [function name]
	 * @return {Function} [a wrapper around an R instance]
	 */
	return function Shuxuejia (filename, entryPoint)	{
		/**
		 * A wrapper around an R instance
		 * @param {Any}   data 
		 * @param {Function} cb   [err, ret-data]
		 */
		return function Rinst(data, cb)	{
				if(!fs.existsSync(FILE(filename)))	{
				console.warn('`Shuxuejia` attempted to use an undefined `R` file: ', FILE(filename));
				cb('R file does not exists');
			}	else	{
				rio.sourceAndEval(FILE(filename), {
					entryPoint	: entryPoint,
					data		: data,
					callback	: cb
				});
			}
		}
	}
}

