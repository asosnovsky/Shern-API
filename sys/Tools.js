/* Load dependencies */
var PATH 	= require('./Tools/Path'),
	URL  	= require('./Tools/Url'),
	Docs  	= require('./Tools/Docs');

/**
 * loads tools
 * @param  {Class} config 
 * @return {Class}        
 */
module.exports = function (config) {
	var Tools = {};
	
	if( config.dev.host.port ){
		// console.log('config.dev', config.dev);
		config = config.dev;
	}	else	if( config.prod.host.port ){
		// console.log('config.prod', config.prod);
		config = config.prod;
	}	else	{
		throw new Error('can\'t determine mode! check if valid `PORT`');
	}

	Tools.config = function (){
		return config;
	}
	
	Tools.PATH 	= PATH(__dirname);
	Tools.URL 	= new URL(config.host);
	Tools.Docs 	= Docs(Tools.PATH);
	
	return Tools;
}	