/* Load dependencies */
var fs	= require('fs');

/**
 * Document loader
 * @param  {Class} PATH 
 * @return {Class}      [a class that deals with loading documents]
 */
module.exports	=	function (PATH)	{
	return function Docs(filetype, options)	{
		filetype = filetype || 'json';//set file-type default
		options = options ||  {encoding: 'utf-8'};//set options default

		/* Load directory and set some globals */
		var FILE = PATH.File('docs', filetype),
			__lfiles = {},
			__wfiles = {};

		/**
		 * load file
		 * @param  {String} filename 
		 * @return {Object}          [returns a document]
		 */
		this.load = function(filename){
			if(fs.existsSync(FILE(filename)))	{
				if(!__lfiles[filename]){
					__lfiles[filename] = fs.readFileSync(FILE(filename));
					if(filetype === 'json'){
						__lfiles[filename] = JSON.parse(__lfiles[filename]);
					}
				}
				return __lfiles[filename];
			}	else	{
				return null;
			}
		}

		/**
		 * save file
		 * @param  {String} filename 
		 * @param  {Object} data
		 */
		this.save = function(filename, data){
			__wfiles[filename] = FILE(filename);
			fs.writeFile(__wfiles[filename], data, function(e, d){
				if(!e)	{
					console.log('Created new file:', __wfiles[filename], 'at:', new Date());
				}	else	{
					console.warn('Unable to create:', '`' + __wfiles[filename] + '`', 'at:', new Date());
					console.warn('error:', e);
					console.warn('data:', d);
				}
			});
		}

		/**
		 * Adds a special function in case of json file-types
		 * @param  {string} filetype 
		 * @return {Function}          
		 */
		if(filetype === 'json')	{
			/**
			 * writes a json to folder
			 * @param  {String} filename 
			 * @param  {Object} json
			 */
			this.write = function(filename, json){
				this.save(filename, JSON.stringify(json))
			}
		}
	}
}
