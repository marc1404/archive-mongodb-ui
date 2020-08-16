var mongo = require("mongodb").MongoClient;
var async = require("async");
var admin;

mongo.connect("mongodb://localhost:27017", function(err, db){
	admin = db.admin();
});

module.exports = function(req, res){
	admin.listDatabases(onListDatabases);
	
	function onListDatabases(err, list){
		var databases = [];
		var tasks = [];
		
		for(var i = 0; i < list.databases.length; i++){
			var name = list.databases[i].name;
			var task = createDatabaseInfoTask(name, function(database){
				databases.push(database);
			});
			
			tasks.push(task);
		}
		
		async.parallel(tasks, function(){
			res.send(databases);
		});
	}

	function createDatabaseInfoTask(dbName, callback){
		return function(done){
			mongo.connect("mongodb://localhost:27017/" + dbName, function(err, db){
				getDatabaseInfo(db, function(database){
					callback(database);
					done();
				});
			});
		};
	}

	function getDatabaseInfo(database, callback){
		countCollectionsAndDocuments(database, function(collections, documents){
			callback({
				name: database.databaseName,
				collections: collections,
				documents: documents
			});
		});
	}

	function countCollectionsAndDocuments(database, callback){
		database.collections(function(err, collections){
			var collectionCount = collections.length;
			var documentCount = 0;
			var tasks = [];
			
			for(var i = 0; i < collections.length; i++){
				var collection = collections[i];
				var task = createCountDocumentsTask(collection, function(documents){
					documentCount += documents;
				});
				
				tasks.push(task);
			}
			
			async.parallel(tasks, function(){
				callback(collectionCount, documentCount);
			});
		});
	}

	function createCountDocumentsTask(collection, callback){
		return function(done){
			countDocuments(collection, function(documents){
				callback(documents);
				done();
			});
		};
	}

	function countDocuments(collection, callback){
		collection.find().count(function(err, count){
			callback(count);
		});
	}
};