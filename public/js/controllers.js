'use strict'

/* Controllers */

var app = angular.module('app', [])

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse()
  }
})

app.directive('ng-placeholder', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {      
      
      var value;
      
      var placehold = function () {
          element.val(attr.placehold)
      };
      var unplacehold = function () {
          element.val('');
      };
      
      scope.$watch(attr.ngModel, function (val) {
        value = val || '';
      });

      element.bind('focus', function () {
         if(value == '') unplacehold();
      });
      
      element.bind('blur', function () {
         if (element.val() == '') placehold();
      });
      
      ctrl.$formatters.unshift(function (val) {
        if (!val) {
          placehold();
          value = '';
          return attr.placehold;
        }
        return val;
      });
    }
  };
})

app.controller('MainCtrl', function($scope, $http) {

  $http.get('data/people.json').success(onpeople)
  $http.get('data/caps.json').success(oncaps)
  
  $scope.give = {}
  $scope.setFormItem = setFormItem
  $scope.giveCap = giveCap
  $scope.showForm = showForm

  resetForm()
 // dev()

  function dev() {
    $scope.give = {
      'peopleId': 1,
      'capId': 1,
      'reason': 'Some reason'
    }
  }


  function resetForm() {
    $scope.give = {
      'peopleId': null,
      'capId': null,
      'reason': ''
    }
    setPlaceholder()
    $scope.formShown = false
  }

  function setPlaceholder() {
    var capName = '',
      peopleName = '',
      give = $scope.give
  
    if(give.capId != null) {
      capName = $scope.caps && $scope.caps[give.capId].name
    }

    if(give.peopleId != null) {
      peopleName = $scope.people && (' ' + $scope.people[give.peopleId].name + ' for')
    }

    give.placeholder = ["This", capName + "cap", "is given to" + peopleName + "…"].join(' ')
      
    console.log($scope.give)
  }

  function onpeople(data) {
    $scope.people = data
  }

  function oncaps(data) {
    $scope.caps = data
  }
    
  function setFormItem(data) {
    var give = $scope.give
    _.extend(give, data)

    setPlaceholder()
  }

  function showForm() {
    $scope.formShown = true
  }

  function hideForm() {
    resetForm()
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

    hideForm()
  }


})

