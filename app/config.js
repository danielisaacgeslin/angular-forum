(function(){
	"use strict";

	angular.module('app').config(config).constant('constants',constants());

	function config($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('/', {
			url : "/",
			templateUrl : "main.html",
			controller: 'mainController',
			controllerAs: 'vm'
		});
	}

	function constants(){
		return {
			serviceUrl: '/dgeslin/'
		};
	}

})();
