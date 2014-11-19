
module.exports = function cornfed(worker, events) {
	// ops :: { eventName: report_schema }
	var _post, schema, evnt;
	for (evnt in events){
		set_handler(evnt)
	}
	window.addEventListener('beforeunload', function (){
		worker.postMessage('session_end')
	})
	function set_handler(evnt) {
		var schema, _post;
		schema = events[evnt] || []; 
		_post = function _post(event) {
				var prop, val, e = {}, evnt = evnt;
				var props = schema.length;
				while (--props){
					val = event[prop];
					if (val && val.nodeType){
						val = {
							'tag': val.tagName,
							'class': val.classList.toString(),
							'id': val.id,
							'value': val.nodeValue
						}
					}
					e[prop] = val;
				}
				e['timestamp'] = new Date().getTime();
				e['type'] = event.type;
				worker.postMessage(e)

		}
		document.addEventListener(evnt, _post, true);
	}
}