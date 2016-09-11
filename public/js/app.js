!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){!function(){"use strict";function config($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("/",{url:"/",templateUrl:"main.html",controller:"mainController",controllerAs:"vm"}).state("/article",{url:"/article/:id",templateUrl:"article.html",controller:"articleController",controllerAs:"vm"}).state("/tags",{url:"/tags",templateUrl:"tags.html",controller:"tagsController",controllerAs:"vm"})}function constants(){return{serviceUrl:"/dgeslin/"}}angular.module("app").config(config).constant("constants",constants())}()},{}],2:[function(require,module,exports){!function(){"use strict";function appController($scope,$state){function _activate(){_updateRoute()}function _updateRoute(){vm.route=$state.current.name}var vm=this;vm.route=null,_activate(),$scope.$watch(function(){return $state.current},_updateRoute)}angular.module("app").controller("appController",appController),appController.$inject=["$scope","$state"]}()},{}],3:[function(require,module,exports){!function(){"use strict";function articleController($scope,$state,$q,storeService){function _activate(){isNaN($state.params.id)?_getTags().then(_filterTags):_getArticle().then(function(){_getComments(),$q.all([_getArticleTagList(),_getTags()]).then(_filterTags)})}function _getArticle(){return storeService.getArticle(vm.tempId?vm.tempId:$state.params.id).then(function(article){vm.article=article,vm.edition=Object.assign({},article)})}function _getComments(){return storeService.getComments(vm.article.id)}function _getArticleTagList(){return storeService.getArticleTagList(vm.article.id)}function _getTags(){return storeService.getTags().then(function(tags){vm.tags=tags})}function _filterTags(){var marker,filteredTags={};if(!vm.article.id)return vm.filteredTags=vm.noTagOption,vm.selectedTag=vm.filteredTags[Object.keys(vm.filteredTags)[0]],!1;for(var tagKey in vm.tags){marker=!0;for(var articleTagKey in vm.article.tags)if(articleTagKey===vm.tags[tagKey].id){marker=!1;break}marker&&(filteredTags[tagKey]=Object.assign({},vm.tags[tagKey]))}vm.filteredTags=filteredTags,Object.keys(vm.filteredTags).length||(vm.filteredTags=vm.noTagOption),vm.selectedTag=vm.filteredTags[Object.keys(vm.filteredTags)[0]]}function _setArticle(){return storeService.setArticle(vm.edition.title,vm.edition.description,vm.edition.body,vm.article.id).then(function(id){vm.article.id||(vm.tempId=id,$state.go("/article",{id:id},{notify:!1,reload:!1,location:"replace",inherit:!0}))})}function toggleEdit(){vm.editEnabled=!vm.editEnabled,vm.editEnabled||(vm.edition=Object.assign({},vm.article))}function saveArticle(){_setArticle().then(_getArticle).then(_getArticleTagList).then(_filterTags)}function saveComment(){return storeService.setComment(vm.newComment,vm.article.id).then(function(){vm.newComment=""})}function updateComment(commentId){return storeService.setComment(vm.editableCommentText,null,commentId).then(editComment)}function editComment(index,commentId){vm.editableCommentText="",vm.editableComment===index?vm.editableComment=-1:(vm.editableComment=index,vm.editableCommentText=commentId?vm.article.comments[commentId].text:"")}function deleteComment(commentId){return storeService.deleteComment(commentId,vm.article.id)}function setTag(){storeService.setTag(vm.article.id,vm.selectedTag.id).then(_getArticleTagList).then(_filterTags)}function deleteTag(tagId){return storeService.deleteTag(vm.article.id,tagId).then(_filterTags)}var vm=this;vm.article={},vm.edition={},vm.newComment="",vm.editableComment=-1,vm.editableCommentText="",vm.filteredTags={},vm.noTagOption={0:{id:0,text:"No tags available"}},vm.selectedTag=null,vm.tempId=null,vm.editEnabled=!0,vm.toggleEdit=toggleEdit,vm.saveArticle=saveArticle,vm.saveComment=saveComment,vm.editComment=editComment,vm.updateComment=updateComment,vm.deleteComment=deleteComment,vm.setTag=setTag,vm.deleteTag=deleteTag,_activate()}angular.module("app").controller("articleController",articleController),articleController.$inject=["$scope","$state","$q","storeService"]}()},{}],4:[function(require,module,exports){!function(){"use strict";function mainController($scope,storeService){function _activate(){storeService.getArticleList().then(function(articles){vm.articles=articles})}function deleteArticle(articleId){storeService.deleteArticle(articleId)}var vm=this;vm.articles={},vm.deleteArticle=deleteArticle,_activate()}angular.module("app").controller("mainController",mainController),mainController.$inject=["$scope","storeService"]}()},{}],5:[function(require,module,exports){!function(){"use strict";function tagsController($scope,storeService){function _activate(){storeService.getTags().then(function(tags){vm.tags=tags})}var vm=this;vm.tags={},_activate()}angular.module("app").controller("tagsController",tagsController),tagsController.$inject=["$scope","storeService"]}()},{}],6:[function(require,module,exports){require("./modules/app.module"),require("./config"),require("./services/process.service"),require("./services/ajax.service"),require("./services/store.service"),require("./controllers/app.controller"),require("./controllers/main.controller"),require("./controllers/article.controller"),require("./controllers/tags.controller")},{"./config":1,"./controllers/app.controller":2,"./controllers/article.controller":3,"./controllers/main.controller":4,"./controllers/tags.controller":5,"./modules/app.module":7,"./services/ajax.service":8,"./services/process.service":9,"./services/store.service":10}],7:[function(require,module,exports){!function(){"use strict";angular.module("app",["ui.router","ngSanitize"])}()},{}],8:[function(require,module,exports){!function(){"use strict";function ajaxService($http,$httpParamSerializerJQLike,constants){function ping(){return $http.get(url.concat("?route=ping"))}function getArticle(articleId){return $http.get(url.concat("?route=getArticle&id=").concat(articleId))}function getArticleList(){return $http.get(url.concat("?route=getArticleList"))}function getArticleTagList(articleId){return $http.get(url.concat("?route=getArticleTagList&article_id=").concat(articleId))}function getComments(articleId){return $http.get(url.concat("?route=getComments&article_id=").concat(articleId))}function getTags(){return $http.get(url.concat("?route=getTags"))}function saveArticle(title,description,body){return $http({url:url.concat("?route=saveArticle"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({title:title,description:description,body:body})})}function updateArticle(articleId,title,description,body){return $http({url:url.concat("?route=updateArticle"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({article_id:articleId,title:title,description:description,body:body})})}function deleteArticle(articleId){return $http({url:url.concat("?route=deleteArticle"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({article_id:articleId})})}function addTag(articleId,tagId){return $http({url:url.concat("?route=addTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({article_id:articleId,tag_id:tagId})})}function removeTag(articleId,tagId){return $http({url:url.concat("?route=removeTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({article_id:articleId,tag_id:tagId})})}function saveComment(comment,articleId){return $http({url:url.concat("?route=saveComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment:comment,article_id:articleId})})}function deleteComment(commentId){return $http({url:url.concat("?route=deleteComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment_id:commentId})})}function updateComment(comment,commentId){return $http({url:url.concat("?route=updateComment"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({comment_id:commentId,comment:comment})})}function saveTag(tag){return $http({url:url.concat("?route=saveTag"),method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$httpParamSerializerJQLike({tag:tag})})}var url=constants.serviceUrl;return{ping:ping,getArticle:getArticle,getArticleList:getArticleList,getArticleTagList:getArticleTagList,getComments:getComments,getTags:getTags,saveArticle:saveArticle,updateArticle:updateArticle,deleteArticle:deleteArticle,addTag:addTag,removeTag:removeTag,saveComment:saveComment,deleteComment:deleteComment,updateComment:updateComment,saveTag:saveTag}}angular.module("app").factory("ajaxService",ajaxService),ajaxService.$inject=["$http","$httpParamSerializerJQLike","constants"]}()},{}],9:[function(require,module,exports){!function(){"use strict";function processService(){function dbArrayAdapter(dbArray){var value,dbObject={},tempObj={};return"object"!=typeof dbArray?tempObj:(dbArray.forEach(function(object){tempObj={};for(var key in object)value=object[key],new RegExp("timestamp","i").test(key)&&(value=new Date(value)),tempObj[key.toLowerCase()]=value;dbObject[tempObj.id]=tempObj}),dbObject)}return{dbArrayAdapter:dbArrayAdapter}}angular.module("app").factory("processService",processService),processService.$inject=[]}()},{}],10:[function(require,module,exports){!function(){"use strict";function storeService(ajaxService,processService,$q){function getArticle(articleId){var article,defer=$q.defer();return articles[articleId]?defer.resolve(articles[articleId]):ajaxService.getArticle(articleId).then(function(response){article=processService.dbArrayAdapter(response.data.payload),articles[articleId]=article[Object.keys(article)[0]],defer.resolve(articles[articleId])}),defer.promise}function getArticleList(){var defer=$q.defer();return ajaxService.getArticleList().then(function(response){articles=Object.assign(processService.dbArrayAdapter(response.data.payload),articles),defer.resolve(articles)}),defer.promise}function getArticleTagList(articleId){var articleTags,defer=$q.defer();return ajaxService.getArticleTagList(articleId).then(function(response){articleTags=processService.dbArrayAdapter(response.data.payload),Object.assign(tags,articleTags),articles[articleId].tags=articleTags,defer.resolve(articleTags)}),defer.promise}function getComments(articleId){var newComments,defer=$q.defer();return ajaxService.getComments(articleId).then(function(response){newComments=processService.dbArrayAdapter(response.data.payload),Object.assign(comments,newComments),articles[articleId].comments=newComments,defer.resolve()}),defer.promise}function getTags(){var defer=$q.defer();return ajaxService.getTags().then(function(response){tags=Object.assign(processService.dbArrayAdapter(response.data.payload),tags),defer.resolve(tags)}),defer.promise}function setArticle(title,description,body,articleId){var defer=$q.defer();return articleId?ajaxService.updateArticle(articleId,title,description,body).then(function(response){resetArticle(articleId),defer.resolve(articleId)}):ajaxService.saveArticle(title,description,body).then(function(response){defer.resolve(response.data.payload)}),defer.promise}function setTag(articleId,tagId,tag){var defer=$q.defer();return ajaxService.addTag(articleId,tagId).then(function(response){defer.resolve(response.data.payload)}),defer.promise}function setComment(comment,articleId,commentId){var defer=$q.defer(),newComment={};return commentId?ajaxService.updateComment(comment,commentId).then(function(response){comments[commentId].text=comment,defer.resolve(response)}):ajaxService.saveComment(comment,articleId).then(function(response){newComment={id:response.data.payload,text:comment,creation_timestamp:new Date},comments[response.data.payload]=newComment,articles[articleId].comments[response.data.payload]=newComment,defer.resolve(response)}),defer.promise}function deleteTag(articleId,tagId){var defer=$q.defer();return ajaxService.removeTag(articleId,tagId).then(function(response){delete articles[articleId].tags[tagId],defer.resolve()}),defer.promise}function deleteArticle(articleId){var defer=$q.defer();return ajaxService.deleteArticle(articleId).then(function(response){if(articles[articleId].comments)for(var key in articles[articleId].comments)delete comments[key];delete articles[articleId],defer.resolve(response)}),defer.promise}function deleteComment(commentId,articleId){var defer=$q.defer();return ajaxService.deleteComment(commentId).then(function(response){delete comments[commentId],delete articles[articleId].comments[commentId],defer.resolve(response)}),defer.promise}function resetArticles(){articles={}}function resetArticle(articleId){delete articles[articleId]}function resetTags(){tags={}}function resetComments(){comments={}}var articles={},comments={},tags={};return{getArticle:getArticle,getArticleList:getArticleList,getArticleTagList:getArticleTagList,getComments:getComments,getTags:getTags,setArticle:setArticle,setTag:setTag,setComment:setComment,deleteTag:deleteTag,deleteArticle:deleteArticle,deleteComment:deleteComment,resetArticles:resetArticles,resetComments:resetComments,resetTags:resetTags}}angular.module("app").factory("storeService",storeService),storeService.$inject=["ajaxService","processService","$q"]}()},{}]},{},[6]);