/*Dependencies*/
var http 	= require('http'),
	request = require('request');

/**
 * A class that handles Socket-io data (Xinshi means Messanger)
 * @param  {Class} PATH 
 * @param  {Class} URL  
 * @param  {Class} BASE 
 * @param  {Class} DOCS 
 * @return {Class}      
 */
module.exports	=	function (PATH, URL, BASE, DOCS)	{
	return	function	Xinshi	(name)	{
		/*Load URL*/
		var URL = require('../Tools/Url'),
			URL = new URL(BASE);
		
		/*Json Documuent handler*/
		var JsonDocs = new DOCS();

		/*Class Variables*/
		Xinshi[name] = {};

		/*Log Handler-Class*/
		Xinshi.Log = function Log(name)	{
			var _log = null;// Initate log

			/* Retrieve Log */
			this.get = function()	{
				if(_log === null)	{
					_log = JsonDocs.load('Log.' + name);
					if(_log === null)	{
						_log = {};
						JsonDocs.write('Log.' + name, _log);
					}
				}
				return _log;
			}

			/* Updates Log */
			this.update = function(log) {
				_log = log;
				JsonDocs.write('Log.' + name, _log);
			}
		}

		/* Analysis Tools */
		Xinshi.tools = {
			/**
			 * Checks for status
			 * @param  {Object} res 
			 * @param  {String} msg 
			 * @return {String}     
			 */
			status: function(res, msg) {
				if(res[msg] === 1) {
					return 'active';
				}	else	if(res[msg] === 0) {
					return 'inactive';
				}	else 	{
					return null;
				}
			},

			/**
			 * Set the data for retrival
			 * @param  {Object} data 			[The data returned from the chip]
			 * @param  {String} msg  			[Messaged sent from client]
			 * @param  {Object} logs 			[All the needed logs]
			 * @param  {String/Optional} key  	[Key of unit]
			 * @return {Object}      			[Returns all the processed data for the instance]
			 */
			setup: function(data, unit, logs, name, key) {
				var key = key || unit;
				var status = this.status(data.res, key);
				Xinshi[name][unit].push({
						unit: key, 
						name: logs.name[key], 
						role: logs.role[key], 
						status: status
					});
				/* Checks for return error */
				if(status === null)	{
					data.error 	= 'invalid active-code!';
					data.status = 400; 
				}	else	{
					data.error  = null;
					data.status = 200;
				}

				return data;
			}
		}

		var RoleLog = new Xinshi.Log('Role');
		var NameLog = new Xinshi.Log('Name');
		var testLog = new Xinshi.Log('Test');
		
		/**
		 * Main Communication function
		 * @param  {Object} data 
		 * @param  {String} unit  
		 * @param  {String} name 
		 * @param  {Object} changes 
		 * @return {Object}      
		 */
		function comm(data, unit, name, changes) {
			/* Define sample logs for testing */
			var _role_log = RoleLog.get();
			var _name_log = NameLog.get();
			if(data.error)	{
				Xinshi[name][unit] = null;
				data.status = 400;
				return data;
			}
			if(unit === 'A')	{//	Checks for all data
				/* Create return objects */
				Object.keys(data.res).forEach(function(key){
					if(!_role_log[key])	{
						_role_log[key] = '[NA]';
						RoleLog.update(_role_log);
					}
					if(!_name_log[key])	{
						_name_log[key] = 'unit-' + key;
						NameLog.update(_name_log);
					}
					data = Xinshi.tools.setup(//	Set the appropriate data
						data, 
						unit, 
						{
							role: RoleLog.get(), 
							name: NameLog.get()
						}, 
						name,
						key
					);
				});
			}	else	if(!isNaN(data.res[unit]))	{//	In case of numeric data
				if(changes)	{
					(changes.name)&&(
						_name_log[unit] = changes.name,
						NameLog.update(_name_log)
					);
					(changes.role)&&(
						_role_log[unit] = changes.role,
						RoleLog.update(_role_log)
					);
				}
				/* Create return object */
					data = Xinshi.tools.setup(//	Set the appropriate data
						data, 
						unit, 
						{
							role: RoleLog.get(), 
							name: NameLog.get()
						},
						name
					);
			}	else	{//	In case of 'un-named unit' case
				data.error  = 'unit not found';
				data.status = 404;
				Xinshi[name][unit] = null;
			}
			/* Return final data */
			return data;
		}
		
		/*Check if a valid route is requested*/
		if(!(BASE.routes[name] || name === 'change')){
			throw new Error('Nonexisting `Xinshi:' + name + '` created!')
		}

		/*Get the address we will use*/
		this.getaddress = function(){
			return URL.cnstUrl(BASE.routes[name]);
		}

		/*Real Request*/
		this.msg = function(msg, cb) {
			var unit = msg.unit || msg;
			console.log('message requests `', name, ':', unit, '`');
			if(!Xinshi[name][unit])	{//		Use storage as indicator
				Xinshi[name][unit] = [];//	Create Storage

				console.log('[Messaging to]:', URL.cnstUrl(BASE.routes[name] + msg));
				return request(URL.cnstUrl(BASE.routes[name] + msg), function(err, res, body){
					console.log(res, body, err);
					/*Load Data*/
					var pdata = {error: err, res: res, body: body}
					var data = comm(pdata, unit, name, msg);
						
					/*Return Data*/
					cb(
						data.error, 
						Xinshi[name][unit],
						data.status
					);

					/*Delete Storage (disables indicator) */
					delete Xinshi[name][unit];
				});

			}	else	{
				cb(
					'base-overload!', 
					Xinshi[name][unit],
					300
				);
			}
		}
		/*Templated Request*/
		this.tmsg = function(msg, cb) {
			var unit = msg.unit || msg;
			console.log('message requests `', name, ':', unit, '`');
			if(!Xinshi[name][unit])	{//		Use storage as indicator
				Xinshi[name][unit] = [];//	Create Storage

				/*Load Data*/
				var pdata = JsonDocs.load('sample.' + name) || JsonDocs.load('sample.show');
				var data = comm(pdata, unit, name, msg);
				
				/*Return Data*/
				cb(
					data.error, 
					Xinshi[name][unit],
					data.status
				);

				/*Delete Storage (disables indicator) */
				delete Xinshi[name][unit];
			}	else	{
				cb(
					'base-overload!', 
					Xinshi[name][unit],
					300
				);
			}
		}
	}
}