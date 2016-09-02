(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'ajaxService'];

	function mainController($scope, ajaxService) {
		var vm = this;
		vm.test = 'testing this controller';
		ajaxService.ping().then(function(result){console.log(result);});
		console.log(vm.test);
	}
})();
