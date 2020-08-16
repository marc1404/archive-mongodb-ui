var mongo = require("mongodb").MongoClient;
var async = require("async");

module.exports = function(req, res){
	var databaseName = req.params.database;
	
	mongo.connect("mongodb://localhost:27017/" + databaseName, onConnect);
	
	function onConnect(err, db){
		db.collections(function(err, collections){
			var collectionInfos = [];
			var tasks = [];
			
			for(var i = 0; i < collections.length; i++){
				var collection = collections[i];
				var task = createCollectionTask(collection, function(collectionInfo){
					collectionInfos.push(collectionInfo);
				});
				
				tasks.push(task);
			}
			
			async.parallel(tasks, function(){
				res.send(collectionInfos);
			});
		});
	}
	
	function createCollectionTask(collection, callback){
		return function(done){
			collection.find().count(function(err, count){
				callback({ 
					name: collection.collectionName,
					documents: count
				});
				
				done();
			});
		};
	}
};