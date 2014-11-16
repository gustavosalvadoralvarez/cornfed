
module.exports = function cornfed(worker, events) {
	// ops :: { eventName: report_schema }
	var _post, schema;
	Object.keys(events).forEach(function set_handler(evnt, i) {
		try{   // want to be extremely careful not to throw uncaught errors 
			schema = events[evnt]; // in main thread and bring whole page down
			_post = function _post(event) {
				try{
					var prop, e = {}, evnt = evnt;
					schema.forEach(function(prop){
						var val = event[prop];
						if (val && val.nodeType){
							val = {
								'tag': val.tagName,
								'class': val.classList.toString(),
								'id': val.id,
								'value': val.nodeValue
							}
						}
						e[prop] = val;
					})
					e['timestampt'] = new Date().getTime();
					e['type'] = event.type;
					worker.postMessage(e)
				} catch(e){
					console.log(e)
				}
			}
			document.addEventListener(evnt, _post, true);
		} catch(e){
			console.log(e)
		}
		
	})
}