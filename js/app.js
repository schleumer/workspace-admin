var exec = require('child_process').exec;
var iconv = require('iconv-lite');
var removeDiacritics = require('diacritics').remove;

var app = angular.module('LazyAdmin', ['ngRoute', 'ngSanitize']);

app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/main.html',
			controller: 'MainCtrl'
		}).otherwise({
			redirectTo: '/'
		});
	}
]);

app.controller("MainCtrl", ['$scope',
	function($scope) {

	}
]);

app.directive("yayServiceStatus", function() {
	return {
		restrict: 'E',
		scope: {
			'name': '='
		},
		templateUrl: 'templates/directives/service-status.html',
		link: function yayServiceStatusLink(scope, element, attrs) {
			scope.status = "Off-line";
			var conditions = scope.name.split(',').map(function(v){
				return "name='" + v + "'";
			});
			alert(conditions);
			var status = exec('wmic /locale:ms_409 service where (' + conditions.join(' or ') + ') list /format:csv', function(error, stdout, stderr){
				console.log(stdout);
				status.kill();
			});
			//status.stderr.on('data', function (data) {
  			//	alert(data);
			//});
			//var first = true;
			//var content = "";
			//status.stdout.on('data', function(data) {
			//	if(first){
			//		first = false;
			//		status.stdin.write('/locale:ms_409 service where name="' + scope.name + '" list /format:csv\n');
			//		status.stdin.end();
			//	} else {
			//		content += data.toString() + "\n";
			//		//data = removeDiacritics(iconv.decode(data, "cp850").toString());
			//		//data = data.split(/\r\n|\r|\n/g)
			//		//data = data.filter(function(v) {
			//		//	return /=/g.test(v);
			//		//});
			//		//data = data.map(function(d) {
			//		//	var keyValue = d.split("=");
			//		//	return {
			//		//		key: keyValue[0],
			//		//		value: keyValue[1]
			//		//	}
			//		//})
			//		//otherdata = {};
			//		//data.forEach(function(v, k){
			//		//	otherdata[v.key] = v.value;
			//		//})
			//		//scope.status = otherdata;
			//		//scope.$apply();
			//		//try {
			//		//	status.kill();
			//		//} catch (ex) {
			//		//	console.log(ex);
			//		//}
			//	}
			//});
			//status.stdout.on('close', function(){
			//	console.log(content);
			//});
		}
	}
});

app.directive("yayServiceSwitch", function(){
	return {
		restrict: 'E',
		scope: {
			'name': '='
		},
		templateUrl: 'templates/directives/service-switch.html',
		link: function yayServiceSwitchLink (scope, element, attrs) {
			
		}
	}
});

app.run(['$rootScope',
	function($rootScope) {
		$rootScope.settings = window.Settings;
	}
]);