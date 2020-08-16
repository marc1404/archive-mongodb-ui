"use strict";

(function(){
	var app = angular.module("MongoDBApp", ["ngRoute", "MongoDBControllers"]);
	
	app.config(["$routeProvider", function($routeProvider){
		$routeProvider.
			when("/databases", {
				controller: "DatabasesController",
				templateUrl: "templates/databases.html"
			}).
			when("/database/:database/collections", {
				controller: "CollectionsController",
				templateUrl: "templates/collections.html"
			}).
			when("/database/:database/collection/:collection/documents", {
				controller: "DocumentsController",
				templateUrl: "templates/documents.html"
			}).
			otherwise({
				redirectTo: "/databases"
			});
	}]);
}());