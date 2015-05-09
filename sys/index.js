//-----------------------------------------
//	System
//-----------------------------------------

/*Setup*/
var config 		= require('./config'),
	Tools  		= require('./Tools')(config),
	Handlers  	= require('./Handlers')(Tools.PATH, Tools.URL, Tools.config().base, Tools.Docs),
	
	/*Create rendering enginge*/
	hbs  		= require('express-handlebars').create({
		defaultLayout: 'main',
		helpers: {
			/**
			 * Creates a url route to bower components
			 * @param {String} type 
			 * @return {String}      
			 */
			setBower: function (type) {
				return Handlers.Bower.createHtml(type);
			},
			
			/**
			 * Creates a url route to public components
			 * @param  {String} name 
			 * @return {String}      
			 */
			getPublic: function (name) {
				return Tools.URL.cnstUrl('public', name);
			}
		}
	}),
	
	/*routes*/
	app  		= require('./router')(Tools.PATH, Tools.URL, Tools.config(), hbs.engine),

	/*Server*/
	http 		= require('http').Server(app),

	/*socket*/
	io 	 		= require('socket.io')(http),
	socket  	= require('./socket')(io, Tools.PATH, Tools.URL, Handlers);

/*Exports*/
module.exports = {
	host: Tools.config().host,
	http: http,
	Handlers: Handlers
};
