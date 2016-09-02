(function(){
	'use strict';
	angular.module('app').controller('articleController', articleController);

	articleController.$inject = ['$scope', '$state', 'storeService'];

	function articleController($scope, $state, storeService) {
		var vm = this;
		vm.article = {};
    
		_activate();
		function _activate(){
			storeService.getArticle($state.params.id).then(function(article){
				vm.article = article;
			});
		}

	}
})();
