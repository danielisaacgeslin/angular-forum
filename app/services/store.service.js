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
      var defer = $q.defer();
      return defer.promise;
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
