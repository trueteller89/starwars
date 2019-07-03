angular.module('myApp', ['ngMaterial', 'md.data.table'])
.factory('Planets', ['$http',function($http) {
	return {
		get : function() {
			return $http.get('http://localhost:3000/planets');
		}
	}
}]).controller('planet', ['$scope','$http','Planets', function($scope, $http, Planets) {
	$scope.plnts = []
	Planets.get()
	.then(function(data) {
		$scope.planets = data.data
		$scope.films = data.data.dataFilms
		$scope.residents = data.data.dataRes
		$scope.planets.forEach(function(el) {
			el.residentNames =[]
			el.residents.forEach(r => {
				el.residentNames.push($scope.residents.filter(item =>item.url === r)[0].name)
			})
			el.filmNames =[]
			el.films.forEach(r => {
				el.filmNames.push($scope.films.filter(item =>item.url === r)[0].title)
			})
		})
	})
	$scope.showDetails = function($index) {
		if ($scope.selected) {
			if ($scope.selected !== $index) {
				$scope.selected = $index
			} else {
				$scope.selected = -1} 
			}
			else {
				$scope.selected = $index
			}
		}
	}]).filter('thousandSuffix', function () {
		return function (input, decimals) {
			var exp, rounded,
			suffixes = ['k', 'm', 'g', 't', 'p', 'e'];
			if(window.isNaN(input)) {
				return null;
			}
			if(input < 1000) {
				return input;
			}
			exp = Math.floor(Math.log(input) / Math.log(1000));
			return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
		};
	});