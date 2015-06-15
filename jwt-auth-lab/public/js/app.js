/**
* app Module
*
* Description
*/
angular.module('app', ['ui.router', 'angular-storage', 'angular-jwt'])

.config([ '$urlRouterProvider', '$stateProvider', 'jwtInterceptorProvider',  '$httpProvider', function ($urlRouterProvider, $stateProvider, jwtInterceptorProvider, $httpProvider) {

	$stateProvider
		.state('index', {
			url : "/",
			templateUrl:"view/index.html",
			controller:"IndexCtrl",
			data : {
				requiresLogin : true,
				role : [ "user", "admin" ]
			}
		})

		.state('admin',{
			url : "/admin",
			templateUrl:"view/admin.html",
			data : {
				requiresLogin : true,
				role : [ "admin" ]  
			}
		})

		.state('login',{
			url : "/login",
			templateUrl:"view/login.html",
			controller:"LoginCtrl"
		})

		.state('signup',{
			url:"/signup",
			templateUrl:"view/signup.html",
			controller:"SignupCtrl"
		})

		$urlRouterProvider.otherwise("/login");
	
}])

.run([ '$state', 'store', '$rootScope', 'jwtHelper', function ($state, store, $rootScope, jwtHelper) {

	store.remove('jwt')

	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

		// if (toState.data && toState.data.requiresLogin) {
		// 	if (!store.get('jwt')) {
		// 		event.preventDefault();
		// 		$state.go('login')
		// 	}else{
		// 		// event.preventDefault();

		// 		// if ( toState.data.role != jwtHelper.decodeToken(store.get('jwt')).role ) {
		// 		// 	$state.go('login')

		// 		// }; 
				
		// 	}
		// };

		if (toState.data && toState.data.requiresLogin) {

			if (!store.get('jwt')) {
				event.preventDefault();

				$state.go('login');

			} 
			else if (toState.data.role.indexOf(jwtHelper.decodeToken(store.get('jwt')).role) == -1 ) {
				event.preventDefault();
				$state.go("login")

			};

		};

		
	})

	
}])

.controller('IndexCtrl', ['$scope', 'store', '$http', 'jwtHelper', function ($scope, store, $http, jwtHelper) {

	$scope.text = "this is index page ng-app"

	$scope.callAPI = function(){
		$http.get('/api').success(function(res){
			$scope.text = res.message
		})
	}
	
}])

.controller('SignupCtrl', ['$scope', '$http','store', '$state',  function ($scope, $http, store, $state) {

	$scope.user = {};

	$scope.submit = function(){
		$http.post('/api/users', $scope.user).success(function(res){
			console.log(res.success)		
			$state.go('index')
		},function(res){
			alert(res.id_token)
		})
		
	}
	
}])

.controller('LoginCtrl', ['$scope', '$http', 'store', '$state', '$http', function ($scope, $http, store, $state, $http) {
	$scope.user = {};

	$scope.submit = function(){
		$http.post('/api/authenticate', $scope.user).success(function(res){
			if (res.data) {
				store.set('jwt', res.data.token)
				$http.defaults.headers.common['x-access-token'] = res.data.token

				if (res.role == "user") {
					$state.go('index')
				}else{
					$state.go('admin')
				}
				
			}else{
				$state.go('signup')
			}
			
		},function(res){
			alert(res.token)
		})
		
	}
	
}])