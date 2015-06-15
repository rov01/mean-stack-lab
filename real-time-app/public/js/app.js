/**
* app Module
*
* Description
*/
angular.module('app', [])
.controller('PostCtrl', ['$scope', 'PostsSvc', 'socketio', function ($scope, PostsSvc, socketio) {


	socketio.on('new_post',function(post){
		$scope.posts.unshift(post)
	})

	// $scope.$on('post',function(_,post){
	// 	$scope.$apply(function(){
	// 		$scope.posts.unshift(post)
	// 	})
	// })

	$scope.addPost = function(){
		if ($scope.postBody) {
			PostsSvc.create({
				body:$scope.postBody
			})
			$scope.postBody = null
		}
	}

	PostsSvc.fetch()
	.success(function(posts){
		$scope.posts = posts
	})
	
}]) 

.service('PostsSvc', ['$http', function ($http) {
	console.log("error")
	this.fetch = function(){
		return $http.get('/api/posts')
	}

	this.create = function(post){
		return $http.post('/api/posts',post)
	}
}])

.factory('socketio',[ '$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}])

.run([ '$rootScope', function ($rootScope) {

	(function connect(){
		var socket = io.connect();
		socket.on('new_post', function (data) {

		    $rootScope.$broadcast('post', data)

		 });

	})()
	
}])
