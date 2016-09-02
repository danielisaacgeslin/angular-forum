(function(){
	"use strict";

	angular.module('app').config(config);

	function config($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('/', {
			url : "/",
			templateUrl : "main.html",
			controller: 'mainController',
			controllerAs: 'vm'
		});
	};

})();
