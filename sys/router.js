//-----------------------------------------
//	Router
//-----------------------------------------

/*Requirements*/
var express = require('express'),
	fs		= require('fs');

/*Exports*/
module.exports = function(PATH, URL, CONFIG, ENGINE) {
	
	/*Set the application*/
	var app = express();
		app.engine('handlebars', ENGINE);
		app.set('view engine', 'handlebars');

	/*Public/Static*/
		app.use('/public', express.static(PATH.main('public')));
		app.use('/bower_components', express.static(PATH.main('bower_components')));

	/* File Load*/
	var FILE = PATH.File('routes');

	/*views*/
	var views = express.Router();
	console.log('[Loading Routes...]');
		fs.readdirSync(PATH.main('routes')).forEach(function(val){
			var route = '/';
			if(val.substr(0,val.length - 3) !== 'index'){
				route += val.substr(0,val.length - 3);
				route = route.replace(/\$/g, '/:');
			}
			console.log('> ' + route);
			views.get(route, function(req, res){
				console.log('`GET ' + route + '` initiated at', new Date());
				require(FILE(val))(req, res, PATH, URL, CONFIG)
			});
		});
	console.log('[Routes Done!]');
		app.use('/', views);

	/*404*/
		app.use(function(req, res, next){
			console.log(req.originalUrl);
			res.status(404);
			res.render('404',{
				origUrl: URL.cnstUrl(req.originalUrl)
			});
		});
	return app;
}