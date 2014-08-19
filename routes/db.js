var express = require('express');
var mongojs = require('mongojs');
var db = mongojs('halicrave');
var router = express.Router();
var httpreq = require('httpreq');


/* GET objects */
router.get('/commands', function(req, res) {
	var objects = db.collection('command');
	objects.find(function(err, docs) {
		console.log(docs);
		res.send(docs);
    // docs is an array of all the documents in mycollection
	});
});

// router.post('/object/new', function(req, res) {
// 	console.log (req);
// 	var objects = db.collection('object');
// 	objects.insert(req.body, function() {
// 		console.log(req.body._id);
// 		res.send(req.body);
// 	});
// });

// router.put('/object/:id', function(req, res) {
// 	//// check here 'https://github.com/mafintosh/mongojs'
// 	var id = req.params.id
// 	console.log (id);
// 	var objects = db.collection('object');
// 	objects.insert(req.body, function() {
// 		res.send(200);
// 	});
// });




module.exports = router;