var spawn = require('child_process').spawn;
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
			var status = spawn('wmic'/*, ['\/locale:ms_409', "service", "where", '(name=' + scope.name + ')', "list", '\/format:list']*/);
			status.stderr.on('data', function (data) {
  				alert(data);
			});
			var first = true;
			status.stdout.on('data', function(data) {
				if(first){
					first = false;
					status.stdin.write('/locale:ms_409 service where name="' + scope.name + '" list /format:list\n');
					status.stdin.end();
				} else {
					data = removeDiacritics(iconv.decode(data, "cp850").toString());
					data = data.split(/\r\n|\r|\n/g)
					data = data.filter(function(v) {
						return /=/g.test(v);
					});
					data = data.map(function(d) {
						var keyValue = d.split("=");
						return {
							key: keyValue[0],
							value: keyValue[1]
						}
					})
					otherdata = {};
					data.forEach(function(v, k){
						otherdata[v.key] = v.value;
					})
					scope.status = otherdata;
					scope.$apply();
					try {
						status.kill();
					} catch (ex) {
						console.log(ex);
					}
				}
			});
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