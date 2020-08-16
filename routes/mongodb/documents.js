var mongo = require("mongodb").MongoClient;
var async = require("async");

module.exports = function(req, res){
	var databaseName = req.params.database;
	
	mongo.connect("mongodb://localhost:27017/" + databaseName, onConnect);
	
	function onConnect(err, db){
		var collectionName = req.params.collection;
		
		db.collection(collectionName, function(err, collection){
			collection.find().toArray(function(err, documents){
				res.send(documents);
			});
		});
	}
};