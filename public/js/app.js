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
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', 'ajaxService'];

	function mainController($scope, ajaxService) {
		var vm = this;
		vm.test = 'testing this controller';
		ajaxService.ping().then(function(result){console.log(result);});
		console.log(vm.test);
	}
})();

},{}],3:[function(require,module,exports){
require('./modules/app.module');
require('./config');
require('./services/ajax.service');
require('./controllers/main.controller');

},{"./config":1,"./controllers/main.controller":2,"./modules/app.module":4,"./services/ajax.service":5}],4:[function(require,module,exports){
module.exports = (function(){
  'use strict';
  angular.module('app', ['ui.router','ngSanitize']);
})();

},{}],5:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', 'constants'];

	function ajaxService($http, constants) {
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
      return $http.get(url.concat('?route=getArticle&article_id=').concat(articleId));
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
    function getComments(){
      return $http.get(url.concat('?route=getComments'));
    }

    /*N/A*/
    function getTags(){
      return $http.get(url.concat('?route=getTags'));
    }

    /*title(string), description(string), body(string)*/
    function saveArticle(title, description, body){
      return $http.post(url.concat('?route=saveArticle'),{
        title:title,
        description:description,
        body:body
      });
    }

    /*article_id(int), title(string), description(string), body(string)*/
    function updateArticle(articleId, title, description, body){
      return $http.post(url.concat('?route=updateArticle'),{
        article_id: articleId,
        title:title,
        description:description,
        body:body
      });
    }

    /*article_id(int)*/
    function deleteArticle(articleId){
      return $http.post(url.concat('?route=deleteArticle'),{
        article_id: articleId
      });
    }

    /*article_id(int), tag_id(int)*/
    function addTag(articleId, tagId){
      return $http.post(url.concat('?route=addTag'),{
        article_id: articleId,
        tag_id: tagId
      });
    }

    /*article_id(int), tag_id(int)*/
    function removeTag(articleId, tagId){
      return $http.post(url.concat('?route=removeTag'),{
        article_id: articleId,
        tag_id: tagId
      });
    }

    /*comment(string), article_id(int)*/
    function saveComment(comment, articleId){
      return $http.post(url.concat('?route=saveComment'),{
        comment: comment,
        article_id: articleId
      });
    }

    /*comment_id(int)*/
    function deleteComment(commentId){
      return $http.post(url.concat('?route=deleteComment'),{
        commentId: commentId
      });
    }

    /*comment_id(int), comment(string)*/
    function updateComment (comment_id, comment){
      return $http.post(url.concat('?route=updateComment'),{
        commentId: commentId,
        comment: comment
      });
    }

    /*tag(string)*/
    function saveTag(tag){
      return $http.post(url.concat('?route=saveTag'),{
        tag: tag
      });
    }

	}
})();

},{}]},{},[3]);
