var app = angular.module("myApp",[]);
app.controller("myCtrl",function($scope,myService) {
	myService.ajaxCallMe('user.json').then(success,error);

    function success(response){
			$scope.contact = response.data;
		};

    function error(response){
			console.log("Error",response);
		};
});
