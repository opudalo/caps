'use strict'

/* Controllers */

var capsApp = angular.module('capsApp', [])

capsApp.controller('MainCtrl', function($scope, $http) {
  $http.get('data/people.json').success(function(data) {
    $scope.people = data
  })

  $http.get('data/caps.json').success(function(data) {
    $scope.caps = data
  })

})

