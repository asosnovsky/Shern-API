//-----------------------------------------
//	Config File
//-----------------------------------------

/* Load dependencies */
var ip = require('ip');

/* Exports */
module.exports = {
	dev: {
		host: {
			port: 8080,
			host: ip.address()
		},
		db: {
			host: '',
			port: 0,
			user: '',
			password: '',
			db: ''
		}
	},
	prod:{
		host: {
			port: process.env.PORT,
			host: ip.address()
		},
		db: {
			host: '',
			port: 0,
			user: '',
			password: '',
			db: ''
		}
	}
}
