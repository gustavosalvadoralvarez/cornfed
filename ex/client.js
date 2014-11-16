var webworkify = require('webworkify');
var cornfed = require('../index.js');


var worker = webworkify(require('./worker.js'));
var evnts = {
	'click': ['clientX', 'clientY', 'target'],
	"mouseover": ['clientX', 'clientY', 'target', 'relatedTarget']
};

cornfed(worker, evnts);