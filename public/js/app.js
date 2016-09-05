(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		}).state('/article', {
			url : "/article/:id",
      templateUrl : "article.html",
      controller: 'articleController',
      controllerAs: 'vm'
		});
	}

	function constants(){
		return {
			serviceUrl: '/dgeslin/'
		};
	}

})();

},{}],2:[function(require,module,exports){
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
		vm.filteredTags = {};
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
			storeService.setTag(vm.article.id, vm.selectedTag.id).then(function(){
				_filterTags();
			});
		}
    /*end public functions*/

	}
})();

},{}],3:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'storeService'];

	function mainController($scope, storeService) {
		var vm = this;
		vm.articles = {};

		vm.deleteArticle = deleteArticle;

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getArticleList().then(function(articles){
				vm.articles = articles;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteArticle(articleId){
			storeService.deleteArticle(articleId);
		}
		/*end public functions*/
	}
})();

},{}],4:[function(require,module,exports){
require('./modules/app.module');
require('./config');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
require('./controllers/main.controller');
require('./controllers/article.controller');

},{"./config":1,"./controllers/article.controller":2,"./controllers/main.controller":3,"./modules/app.module":5,"./services/ajax.service":6,"./services/process.service":7,"./services/store.service":8}],5:[function(require,module,exports){
module.exports = (function(){
  'use strict';
  angular.module('app', ['ui.router','ngSanitize']);
})();

},{}],6:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];

	function ajaxService($http, $httpParamSerializerJQLike, constants) {
    var url = constants.serviceUrl;

		return {
      /*GET*/
      ping: ping, // N/A
      getArticle: getArticle, // article_id(int)
      getArticleList: getArticleList, // N/A
      getArticleTagList: getArticleTagList, // article_id(int)
      getComments: getComments, // article_id(int)
      getTags: getTags, // N/A
      /*POST*/
      saveArticle: saveArticle, // title(string), description(string), body(string)
      updateArticle: updateArticle, // article_id(int), title(string), description(string), body(string)
      deleteArticle: deleteArticle, // article_id(int)
      addTag: addTag, // article_id(int), tag_id(int)
      removeTag: removeTag, // article_id(int), tag_id(int)
      saveComment: saveComment, // comment(string), article_id(int)
      deleteComment: deleteComment, // comment_id(int)
      updateComment: updateComment, // comment_id(int), comment(string)
      saveTag: saveTag // tag(string)
    };

    /*N/A*/
    function ping(){
      return $http.get(url.concat('?route=ping'));
    }

    /*article_id(int)*/
    function getArticle(articleId){
      return $http.get(url.concat('?route=getArticle&id=').concat(articleId));
    }

    /*N/A*/
    function getArticleList(){
      return $http.get(url.concat('?route=getArticleList'));
    }

    /*article_id(int)*/
    function getArticleTagList(articleId){
      return $http.get(url.concat('?route=getArticleTagList&article_id=').concat(articleId));
    }

    /*article_id(int)*/
    function getComments(articleId){
      return $http.get(url.concat('?route=getComments&article_id=').concat(articleId));
    }

    /*N/A*/
    function getTags(){
      return $http.get(url.concat('?route=getTags'));
    }

    /*title(string), description(string), body(string)*/
    function saveArticle(title, description, body){
      return $http({
				url:url.concat('?route=saveArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike({
	        title:title,
	        description:description,
	        body:body
	      })
			});
    }

    /*article_id(int), title(string), description(string), body(string)*/
    function updateArticle(articleId, title, description, body){
      return $http({
				url:url.concat('?route=updateArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
	        article_id: articleId,
	        title:title,
	        description:description,
	        body:body
	      })
			});
    }

    /*article_id(int)*/
    function deleteArticle(articleId){
			return $http({
				url:url.concat('?route=deleteArticle'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
	        article_id: articleId
	      })
			});
    }

    /*article_id(int), tag_id(int)*/
    function addTag(articleId, tagId){
			return $http({
				url:url.concat('?route=addTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					article_id: articleId,
	        tag_id: tagId
	      })
			});
    }

    /*article_id(int), tag_id(int)*/
    function removeTag(articleId, tagId){
			return $http({
				url:url.concat('?route=removeTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					article_id: articleId,
	        tag_id: tagId
	      })
			});
    }

    /*comment(string), article_id(int)*/
    function saveComment(comment, articleId){
			return $http({
				url:url.concat('?route=saveComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment: comment,
	        article_id: articleId
	      })
			});
    }

    /*comment_id(int)*/
    function deleteComment(commentId){
			return $http({
				url:url.concat('?route=deleteComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId
	      })
			});
    }

    /*comment_id(int), comment(string)*/
    function updateComment (comment, commentId){
			return $http({
				url:url.concat('?route=updateComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId,
					comment: comment
	      })
			});
    }

    /*tag(string)*/
    function saveTag(tag){
			return $http({
				url:url.concat('?route=saveTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					tag: tag
	      })
			});
    }

	}
})();

},{}],7:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('processService', processService);

	processService.$inject = [];

	function processService() {
		return {
      dbArrayAdapter: dbArrayAdapter
    };

    function dbArrayAdapter(dbArray){
      var dbObject = {}, tempObj = {}, value;
      if(typeof dbArray !== 'object'){
        return tempObj;
      }
      dbArray.forEach(function(object){
        tempObj = {};
        for(var key in object){
          value = object[key];
          if(new RegExp('timestamp','i').test(key)){
            value = new Date(value);
          }
          tempObj[key.toLowerCase()] = value;
        }
        dbObject[tempObj.id] = tempObj;
      });
      return dbObject;
    }

	}
})();

},{}],8:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('storeService', storeService);

	storeService.$inject = ['ajaxService', 'processService', '$q'];

	function storeService(ajaxService, processService, $q) {
    var articles = {}, comments = {}, tags = {};

		return {
      getArticle: getArticle,
      getArticleList: getArticleList,
      getArticleTagList: getArticleTagList,
      getComments: getComments,
      getTags: getTags,

      setArticle: setArticle,
      setTag: setTag,
      setComment: setComment,

      deleteTag: deleteTag,
      deleteArticle: deleteArticle,
      deleteComment: deleteComment,

      resetArticles: resetArticles,
      resetComments: resetComments,
      resetTags: resetTags
    };

    function getArticle(articleId){
      var defer = $q.defer();
      var article;
      if(articles[articleId]){
        defer.resolve(articles[articleId]);
      }else{
        ajaxService.getArticle(articleId).then(function(response){
          article = processService.dbArrayAdapter(response.data.payload);
          articles[articleId] = article[Object.keys(article)[0]];
          getComments(articleId);
					getArticleTagList(articleId);
					defer.resolve(articles[articleId] ? articles[articleId] : {});
        });
      }
      return defer.promise;
    }

    function getArticleList(){
      var defer = $q.defer();
      ajaxService.getArticleList().then(function(response){
        /*keeping old articles as they were stored*/
        articles = Object.assign(processService.dbArrayAdapter(response.data.payload), articles);
        defer.resolve(articles);
      });
      return defer.promise;
    }

    function getArticleTagList(articleId){
      var defer = $q.defer();
			var articleTags;
			ajaxService.getArticleTagList(articleId).then(function(response){
				articleTags = processService.dbArrayAdapter(response.data.payload);
				Object.assign(tags, articleTags);
				articles[articleId].tags = articleTags;
        defer.resolve(articleTags);
			});
      return defer.promise;
    }

    function getComments(articleId){
      var defer = $q.defer();
      var newComments;
      ajaxService.getComments(articleId).then(function(response){
        newComments = processService.dbArrayAdapter(response.data.payload);
        Object.assign(comments,newComments);
        articles[articleId].comments = newComments;
        defer.resolve();
      });
      return defer.promise;
    }

    function getTags(){
      var defer = $q.defer();
			ajaxService.getTags().then(function(response){
				tags = Object.assign(processService.dbArrayAdapter(response.data.payload), tags);
				defer.resolve(tags);
			});
      return defer.promise;
    }

    function setArticle(title, description, body, articleId){
      var defer = $q.defer();
      /*save*/
      if(!articleId){
        ajaxService.saveArticle(title, description, body).then(function(response){
          defer.resolve(getArticle(response.data.payload));
        });
      /*update*/
      }else{
        ajaxService.updateArticle(articleId, title, description, body).then(function(response){
          resetArticle(articleId);
          defer.resolve(getArticle(articleId));
        });
      }
      return defer.promise;
    }

    function setTag(articleId, tagId, tag){
      var defer = $q.defer();
			if(!tag){
				ajaxService.addTag(articleId, tagId).then(function(response){
					getArticleTagList(articleId).then(function(){
						defer.resolve(tags);
					});
				});
			}else{
				//create new tag
			}
      return defer.promise;
    }

    function setComment(comment, articleId, commentId){
      var defer = $q.defer();
      if(comment, commentId){
        ajaxService.updateComment(comment, commentId).then(function(response){
          comments[commentId].text = comment;
          defer.resolve(response);
        });
      }else{
        ajaxService.saveComment(comment, articleId).then(function(response){
          getComments(articleId);
          defer.resolve(response);
        });
      }
      return defer.promise;
    }

    function deleteTag(tagId){
      var defer = $q.defer();
      return defer.promise;
    }

    function deleteArticle(articleId){
      var defer = $q.defer();
      ajaxService.deleteArticle(articleId).then(function(response){
        if(articles[articleId].comments){
          for(var key in articles[articleId].comments){
            delete comments[key];
          }
        }
        delete articles[articleId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function deleteComment(commentId, articleId){
      var defer = $q.defer();
      ajaxService.deleteComment(commentId).then(function(response){
        delete comments[commentId];
        delete articles[articleId].comments[commentId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function resetArticles(){
      articles = {};
    }

    function resetArticle(articleId){
      delete articles[articleId];
    }

    function resetTags(){
      tags = {};
    }

    function resetComments(){
      comments = {};
    }

	}
})();

},{}]},{},[4]);
