'use strict'

/* Controllers */

var capsApp = angular.module('capsApp', [])

capsApp.controller('MainCtrl', function($scope, $http) {
  $scope.give = {
    'peopleId': null,
    'capId': null,
    'reason': ''
  }

  $http.get('data/people.json').success(onpeople)
  $http.get('data/caps.json').success(oncaps)
  
  $scope.setGiveItem = setGiveItem
  $scope.giveCap = giveCap

  dev()

  function dev() {
    $scope.give = {
      'peopleId': 1,
      'capId': 1,
      'reason': 'Some reason'
    }
  }


  function onpeople(data) {
    $scope.people = data
  }

  function oncaps(data) {
    $scope.caps = data
  }
    
  function setGiveItem(data) {
    _.extend($scope.give, data)
  }

  function giveCap() {
    var d = $scope.give
    if (d.peopleId == null || d.capId == null || !d.reason) return
    console.log(d)
  }


})

