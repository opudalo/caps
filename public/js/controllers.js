'use strict'

/* Controllers */

var capsApp = angular.module('capsApp', [])

capsApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse()
  }
});

capsApp.controller('MainCtrl', function($scope, $http) {
  $scope.give = {
    'peopleId': null,
    'capId': null,
    'reason': ''
  }
  $scope.giveShown = false

  $http.get('data/people.json').success(onpeople)
  $http.get('data/caps.json').success(oncaps)
  
  $scope.setGiveItem = setGiveItem
  $scope.giveCap = giveCap
  $scope.showGive = showGive

 // dev()

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

  function showGive() {
    $scope.giveShown = true
  }

  function giveCap() {
    var give = $scope.give,
      capTo = $scope.people[give.peopleId]
    if (give.peopleId == null || give.capId == null || !give.reason) return
    capTo.caps.push({
      id: give.capId,
      reason: give.reason
    })


    $http({
      url: '/people',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: $scope.people
    })
    console.log($scope.people)
    $scope.giveShown = false
  }


})

