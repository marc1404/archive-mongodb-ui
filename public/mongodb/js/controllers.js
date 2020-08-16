"use strict";

(function(){
	var controllers = angular.module("MongoDBControllers", []);

	controllers.controller("DatabasesController", function($scope, $http){
		$http.get("/api/mongodb/databases").success(function(databases){
			$scope.databases = databases;
		});
	});
	
	controllers.controller("CollectionsController", function($scope, $http, $routeParams){
		$scope.database = $routeParams.database;
		
		$http.get("/api/mongodb/database/" + $scope.database + "/collections").success(function(collections){
			$scope.collections = collections;
		});
	});
	
	controllers.controller("DocumentsController", function($scope, $http, $routeParams, $sce){
		$scope.database = $routeParams.database;
		$scope.collection = $routeParams.collection;
		
		$scope.highlightDocument = function($index){
			return $index === $scope.selected ? "info" : "";
		};
		
		$scope.expandDocument = function($index){
			return $index === $scope.selected ? "document-expand" : "";
		};
		
		$scope.selectDocument = function($index){
			$scope.selected = $index !== $scope.selected ? $index : -1;
		};
		
		$scope.prettyPrintDocument = function(document){
			var copy = document;
			var html = JSON.stringify(copy, null, 3);
			html = html.replace(/\\t/g, "   ").replace(/\\n/g, "<br>");
			
			return $sce.trustAsHtml(html);
		};
		
		$http.get("/api/mongodb/database/" + $scope.database + "/collection/" + $scope.collection + "/documents").success(function(documents){
			$scope.documents = documents;
		});
	});
}());