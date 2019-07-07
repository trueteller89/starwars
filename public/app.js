angular.module('myApp', ['ngMaterial', 'md.data.table'])
	.factory('StarwarsData', ['$http', function ($http) {
		return {
			getPlanets: function () {
				return $http.get('http://localhost:3000/planets');
			},
			getPeopleOrFilms: function (url) {
				return $http.get(url);
			},
		}
	}]).controller('planet', ['$scope', '$http', 'StarwarsData', function ($scope, $http, StarwarsData) {
		$scope.plnts = []
		Promise.resolve(StarwarsData.getPlanets())
			.then(function (result) {
				console.log(result)
				$scope.planets = result.data
				$scope.$digest()
			})
		function getResidentsOrFilmsArr(arr) {
			let promises = []
			let result = []
			arr.forEach(function (el) {
				promises.push(StarwarsData.getPeopleOrFilms(el))
			})
			return Promise.all(promises).then(function (data) {
				data.forEach(function (el) {
					let titleName = el.data.name || el.data.title
					result.push(titleName)
				})
				return result.join(', ')
			})
		}

		$scope.showDetails = function ($index) {
			$scope.currentResidentsNames = ''
			$scope.currentFilmsNames = ''
			if ($scope.selected) {
				if ($scope.selected !== $index) {
					$scope.selected = $index
					getResidentsOrFilmsArr($scope.planets[$index].residents).then(function (res) {
						$scope.currentResidentsNames = res
						$scope.$digest()
					})
					getResidentsOrFilmsArr($scope.planets[$index].films).then(function (res) {
						$scope.currentFilmsNames = res
						$scope.$digest()
					})
				} else {
					$scope.selected = -1
				}
			}
			else {
				$scope.selected = $index
				getResidentsOrFilmsArr($scope.planets[$index].residents).then(function (res) {
					$scope.currentResidentsNames = res
					$scope.$digest()
				})
				getResidentsOrFilmsArr($scope.planets[$index].films).then(function (res) {
					$scope.currentFilmsNames = res
					$scope.$digest()
				})
			}
		}
	}]).filter('thousandSuffix', function () {
		return function (input, decimals) {
			var exp, rounded,
				suffixes = ['k', 'm', 'g', 't', 'p', 'e'];
			if (window.isNaN(input)) {
				return null;
			}
			if (input < 1000) {
				return input;
			}
			exp = Math.floor(Math.log(input) / Math.log(1000));
			return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
		};
	});