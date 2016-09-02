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

},{}],3:[function(require,module,exports){
require('./modules/app.module');
require('./config');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
require('./controllers/main.controller');

},{"./config":1,"./controllers/main.controller":2,"./modules/app.module":4,"./services/ajax.service":5,"./services/process.service":6,"./services/store.service":7}],4:[function(require,module,exports){
module.exports = (function(){
  'use strict';
  angular.module('app', ['ui.router','ngSanitize']);
})();

},{}],5:[function(require,module,exports){
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
    function getComments(){
      return $http.get(url.concat('?route=getComments'));
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
					commentId: commentId
	      })
			});
    }

    /*comment_id(int), comment(string)*/
    function updateComment (comment_id, comment){
			return $http({
				url:url.concat('?route=updateComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					commentId: commentId,
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
      var article;
      var defer = $q.defer();
      if(articles[articleId]){
        defer.resolve(articles[articleId]);
      }else{
        ajaxService.getArticle(articleId).then(function(response){
          article = processService.dbArrayAdapter(response.data.payload);
          articles[articleId] = article[Object.keys(article)[0]];
          defer.resolve(articles[articleId]);
        });
      }
      return defer.promise;
    }

    function getArticleList(){
      var defer = $q.defer();
      if(Object.keys(articles).length){
        defer.resolve(articles);
      }else{
        ajaxService.getArticleList().then(function(response){
          articles = processService.dbArrayAdapter(response.data.payload);
          defer.resolve(articles);
        });
      }

      return defer.promise;
    }

    function getArticleTagList(articleId){
      var defer = $q.defer();
      return defer.promise;
    }

    function getComments(articleId){
      var defer = $q.defer();
      return defer.promise;
    }

    function getTags(){
      var defer = $q.defer();
      return defer.promise;
    }

    function setArticle(articleId, title, description, body){
      /*save*/
      if(!articleId){
        ajaxService.saveArticle(title, description, body).then(function(response){
          return getArticle(response.data.payload);
        });
      }else{
        return ajaxService.updateArticle(articleId, title, description, body);
      }

    }

    function setTag(articleId, tagId, tag){
      var defer = $q.defer();
      return defer.promise;
    }

    function setComment(articleId, commentId, comment){
      var defer = $q.defer();
      return defer.promise;
    }

    function deleteTag(tagId){
      var defer = $q.defer();
      return defer.promise;
    }

    function deleteArticle(articleId){
      var defer = $q.defer();
      return defer.promise;
    }

    function deleteComment(commentId){
      var defer = $q.defer();
      return defer.promise;
    }

    function resetArticles(){
      articles = {};
    }

    function resetTags(){
      tags = {};
    }

    function resetComments(){
      comments = {};
    }

	}
})();

},{}]},{},[3]);
