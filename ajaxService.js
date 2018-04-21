app.service("myService",function($http) {
	this.ajaxCallMe=function(dataUrl){
		return $http({
			method:'GET',
			url:dataUrl
		});
	};
});