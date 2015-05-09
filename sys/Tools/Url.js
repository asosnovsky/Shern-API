/**
 * a URL normilizer class
 * @param  {Object} host [host of interst]
 */
module.exports = function URL (host) {
	
	this.address = 'http://';

	/* if host is added, then add its properties */
	if(host && host.host)	{
		this.address = 'http://' + host.host + ':' + host.port;
	}
	
	/**
	 * Normalizes a url path
	 * @return {String} 
	 */
	this.normUrl = function() {
		var args = Array.prototype.slice.call(arguments);
		var retArg = [];
		args.forEach(function(val,i){
			var newVal = val;
			if(val.constructor === String) {
				if(val.indexOf('/') === 0) {
					newVal = val.replace('/','');
				}
				if(newVal.indexOf('/') > 0) {
					newVal.split('/').forEach(function(subVal){
						retArg.push(subVal);
					});
				}	else	{
					retArg.push(newVal);
				}
			} else {
				retArg.push(newVal);
			};
		});
		return retArg.join('/');
	};

	/**
	 * constructs a url
	 * @return {String} 
	 */
	this.cnstUrl = function(){
		var add = [this.address];
		var args = Array.prototype.slice.call(arguments);

		return this.normUrl.apply(null, add.concat(args));

	}
}