(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var webworkify = require('webworkify');
var cornfed = require('../index.js');


var worker = webworkify(require('./worker.js'));
var evnts = {
	'click': ['clientX', 'clientY', 'target'],
	"mouseover": ['clientX', 'clientY', 'target', 'relatedTarget']
};

cornfed(worker, evnts);
},{"../index.js":3,"./worker.js":2,"webworkify":5}],2:[function(require,module,exports){
module.exports = function worker(self){
	self.addEventListener('message',function(msg){
		console.log(msg.data)
	})
}
},{}],3:[function(require,module,exports){
var nodestring = require('./lib/node-string.js');
module.exports = function cornfed(worker, events) {
	// ops :: { eventName: report_schema }
	var _post, schema;
	Object.keys(events).forEach(function set_handler(evnt, i) {
		try{   // want to be extremely careful not to throw uncaught errors 
			schema = events[evnt]; // in main thread and bring whole page down
			_post = function _post(event) {
				try{
					var prop, e = {};
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
},{"./lib/node-string.js":4}],4:[function(require,module,exports){
module.exports = function node_string(node){
	return {
		'tag': node.tagName,
		'class': node.classList.toString(),
		'id': node.id,
		'value': node.nodeValue
	}
}
},{}],5:[function(require,module,exports){
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn) {
    var keys = [];
    var wkey;
    var cacheKeys = Object.keys(cache);
    
    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        if (cache[key].exports === fn) {
            wkey = key;
            break;
        }
    }
    
    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            Function(['require','module','exports'], '(' + fn + ')(self)'),
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
    
    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        Function(['require'],'require(' + stringify(wkey) + ')(self)'),
        scache
    ];
    
    var src = '(' + bundleFn + ')({'
        + Object.keys(sources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;
    return new Worker(window.URL.createObjectURL(
        new Blob([src], { type: 'text/javascript' })
    ));
};

},{}]},{},[1]);
