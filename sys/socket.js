/* Load dependencies */
var fs 	= require('fs');

/**
 * Socket wrapper
 * @param  {Class} io       
 * @param  {Class} PATH     
 * @param  {Class} URL      
 * @param  {Class} Handlers 
 * @return {Class}          
 */
module.exports = function socket (io, PATH, URL, Handlers) {
	/* Load Directory */
	var DIRNAME = PATH.main('sockets');
	var FILE 	= PATH.File('sockets');
		socket.dir = socket.dir || fs.readdirSync(DIRNAME);

	console.log('[Loading sockets...]');
	socket.dir.forEach(function(val){
		if(val.indexOf('.js') === val.length - 3){
			console.log('> ' + val.substr(0,val.length - 3));
			require(FILE(val))(io, PATH, URL, Handlers);

		}	else	{
			console.warn('improper file extension: `sys/Sockets/' + val + '`');
		};
	});
	console.log('[Sockets Done!]');
}