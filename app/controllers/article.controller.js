(function(){
	'use strict';
	angular.module('app').controller('articleController', articleController);

	articleController.$inject = ['$scope', '$state', 'storeService'];

	function articleController($scope, $state, storeService) {
		var vm = this;
		vm.article = {};
    vm.edition = {};
    vm.newComment = '';
    vm.editableComment = -1;
    vm.editableCommentText = '';
		vm.filteredTags = {};
		vm.noTagOption = {0: {id: 0, text: 'No tags available'}};
		vm.selectedTag;

    vm.toggleEdit = toggleEdit;
    vm.saveArticle = saveArticle;
    vm.saveComment = saveComment;
    vm.editComment = editComment;
    vm.updateComment = updateComment;
    vm.deleteComment = deleteComment;
		vm.setTag = setTag;

		_activate();
    /*private functions*/
		function _activate(){
      if(isNaN($state.params.id)){
        vm.editEnabled = true;
				_getTags();
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
				if(!vm.article.tags){
					_getArticleTagList().then(_getTags);
				}else{
					_getTags();
				}
			});
    }

    function _getComments(){
      storeService.getComments(vm.article.id);
    }

		function _getArticleTagList(){
			return storeService.getArticleTagList(vm.article.id);
		}

		function _getTags(){
			storeService.getTags().then(function(tags){
				vm.tags = tags;
				_filterTags();
			});
		}

		function _filterTags(){
			var filteredTags = {},  marker;
			if(!vm.article.id){
				vm.filteredTags = vm.noTagOption;
				vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
				return false;
			}
			for(var tagKey in vm.tags){
				marker = true;
					for(var articleTagKey in vm.article.tags){
						if(articleTagKey === vm.tags[tagKey].id){
							marker = false;
							break;
						}
					}
					if(marker){
						filteredTags[tagKey] = Object.assign({}, vm.tags[tagKey]);
					}
			}
			vm.filteredTags = filteredTags;
			if(!Object.keys(vm.filteredTags).length){
				vm.filteredTags = vm.noTagOption;
			}
			vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
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
					_getTags();
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

		function setTag(){
			storeService.setTag(vm.article.id, vm.selectedTag.id).then(_filterTags);
		}
    /*end public functions*/

	}
})();
