//-----------------------------------------
//	Server
//-----------------------------------------

/* Load dependencies */
	var midware = require('./sys'),
		host 	= midware.host,
		http 	= midware.http,
		ip		= require('ip').address();

/* Set http client */
	console.log('setting up server...');
	http.listen(host.port, function(){
		console.log('listening on port:', host.port);
		console.log('Running on address:', ip + ':' + host.port + '/');
	});

// module.exports = midware;