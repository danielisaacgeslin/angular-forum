(function(){
	'use strict';
	angular.module('app').controller('articleController', articleController);

	articleController.$inject = ['$scope', '$state', 'storeService'];

	function articleController($scope, $state, storeService) {
		var vm = this;
    vm.editEnabled = false;
		vm.article = {};
    vm.edition = {};

    vm.toggleEdit = toggleEdit;
    vm.saveArticle = saveArticle;

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
        vm.editEnabled = true;
      }else{
        _getArticle($state.params.id);
      }
		}
    function _getArticle(articleId){
      storeService.getArticle(articleId).then(function(article){
				vm.article = article;
        vm.edition = Object.assign({},article);
			});
    }
    /*end private functions*/

    /*public functions*/
    function toggleEdit(){
      vm.editEnabled = !vm.editEnabled;
      if(!vm.editEnabled){
        vm.edition = Object.assign({},vm.article);
      }
    }
    function saveArticle(){
      storeService.setArticle(vm.edition.title, vm.edition.description, vm.edition.body, vm.article.id).then(function(article){
        if(!vm.article.id){
          $state.go('/article', {id: article.id}, {notify: false});
        }
        vm.article = article;
        vm.edition = Object.assign({},article);
      });
    }
    /*end public functions*/

	}
})();
