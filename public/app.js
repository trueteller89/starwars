angular.module('myApp', ['ngMaterial', 'md.data.table'])
	.factory('StarwarsData', ['$http', function ($http) {
		return {
			getPlanets: function () {
				return $http.get('http://localhost:3000/planets');
			},
			getPeople: function (id) {
				return $http.get('http://localhost:3000/people/' + id);
			},
			getFilms: function (id) {
				return $http.get('http://localhost:3000/films/' + id);
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
		function getPeople(arr) {
			let promises = []
			let result = []
			arr = arr.map(function (el) {
				el = el.substring(el.lastIndexOf('people/'), el.lastIndexOf('/')).split('/')[1]
				return el
			})
			arr.forEach(function (el) {
				promises.push(StarwarsData.getPeople(el))
			})
			return Promise.all(promises).then(function (data) {
				data.forEach(function (el) {
					result.push(el.data.name)
				})
				return result.join(', ')
			}).then(function (res) {
				$scope.currentResidentsNames = res
				$scope.$digest()
			})
		}
		function getFilms(arr) {
			let promises = []
			let result = []
			arr = arr.map(function (el) {
				el = el.substring(el.lastIndexOf('films/'), el.lastIndexOf('/')).split('/')[1]
				return el
			})
			arr.forEach(function (el) {
				promises.push(StarwarsData.getFilms(el))
			})
			return Promise.all(promises).then(function (data) {
				data.forEach(function (el) {
					result.push(el.data.title)
				})
				return result.join(', ')
			}).then(function (res) {
				$scope.currentFilmsNames = res
				$scope.$digest()
			})
		}

		$scope.showDetails = function ($index) {
			$scope.currentResidentsNames = ''
			$scope.currentFilmsNames = ''
			if ($scope.selected) {
				if ($scope.selected !== $index) {
					$scope.selected = $index
					getPeople($scope.planets[$index].residents)
					getFilms($scope.planets[$index].films)
				} else {
					$scope.selected = -1
				}
			}
			else {
				$scope.selected = $index
				getPeople($scope.planets[$index].residents)
				getFilms($scope.planets[$index].films)
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