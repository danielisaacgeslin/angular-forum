(function(){
	'use strict';
	angular.module('app').controller('articleController', articleController);

	articleController.$inject = ['$scope', '$state', 'storeService'];

	function articleController($scope, $state, storeService) {
		var vm = this;
    vm.editEnabled = false;
		vm.article = {};
    vm.edition = {};
    vm.newComment = '';
    vm.editableComment = -1;
    vm.editableCommentText = '';

    vm.toggleEdit = toggleEdit;
    vm.saveArticle = saveArticle;
    vm.saveComment = saveComment;
    vm.editComment = editComment;
    vm.updateComment = updateComment;
    vm.deleteComment = deleteComment;

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
        vm.editEnabled = true;
      }else{
        _getArticle();
      }
		}

    function _getArticle(){
      storeService.getArticle($state.params.id).then(function(article){
				vm.article = article;
        vm.edition = Object.assign({},article);
        if(!vm.article.comments){
          _getComments();
        }
			});
    }

    function _getComments(){
      storeService.getComments(vm.article.id);
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
          $state.go('/article', {id: article.id}, {
					    notify:false,
					    reload:false,
					    location:'replace',
					    inherit:true
					});
        }
        vm.article = article;
        vm.edition = Object.assign({},vm.article);
      });
    }

    function saveComment(){
      storeService.setComment(vm.newComment, vm.article.id).then(function(){
        vm.newComment = '';
      });
    }

    function updateComment(commentId){
      storeService.setComment(vm.editableCommentText, null, commentId).then(editComment);
    }

    function editComment(index, commentId){
      vm.editableCommentText = '';
      if(vm.editableComment == index){
        vm.editableComment = -1;
      }else{
        vm.editableComment = index;
        vm.editableCommentText = !commentId ? '' : vm.article.comments[commentId].text;
      }
    }

    function deleteComment(commentId){
      storeService.deleteComment(commentId, vm.article.id);
    }
    /*end public functions*/

	}
})();
