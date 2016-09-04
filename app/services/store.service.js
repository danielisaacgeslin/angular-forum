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
      return defer.promise;
    }

    function getComments(articleId){
      var defer = $q.defer();
      var newComments;
      ajaxService.getComments(articleId).then(function(response){
        newComments = processService.dbArrayAdapter(response.data.payload);
        Object.assign(comments,newComments);
        articles[articleId].comments = newComments;
      });
      return defer.promise;
    }

    function getTags(){
      var defer = $q.defer();
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
        defer.resolve();
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
