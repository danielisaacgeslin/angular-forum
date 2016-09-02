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

    }

    function getComments(articleId){

    }

    function getTags(){

    }

    function setArticle(articleId, title, description, body){

    }

    function setTag(articleId, tagId, tag){

    }

    function setComment(articleId, commentId, comment){

    }

    function deleteTag(tagId){

    }

    function deleteArticle(articleId){

    }

    function deleteComment(commentId){

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
