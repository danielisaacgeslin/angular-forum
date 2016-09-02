(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.articles = {};

		_activate();
		function _activate(){
			storeService.getArticleList().then(function(articles){
				vm.articles = articles;
			});
			//storeService.setArticle(null,'titulo '.concat(Date.now()),'algo','cuerpo');
		}

	}
})();
