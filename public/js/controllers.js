'use strict'

/* Controllers */

var app = angular.module('app', [])

app.filter('reverse', function() {
  return function(items) {
    if (!items) return 
    return _.sortBy(items,'timestamp').reverse()
  }
})

app.controller('MainCtrl', function($scope, $http) {

  $http.get('data/people.json').success(onpeople)
  $http.get('data/caps.json').success(oncaps)
  
  $scope.give = {}
  $scope.setFormItem = setFormItem
  $scope.giveCap = giveCap
  $scope.withdrawCap = withdrawCap
  $scope.showForm = showForm
  $scope.hideForm = hideForm

  resetForm()
  //dev()

  function dev() {
    $scope.formShown = true
    $scope.give = {
      'peopleId': 1,
      //'capId': 1,
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
      capName = $scope.caps && ($scope.caps[give.capId].name + ' ')
    }

    if(give.peopleId != null) {
      peopleName = $scope.people && (' ' + $scope.people[give.peopleId].name + ' for')
    }

    give.placeholder = ["I give this", capName + "cap", "to" + peopleName + "…"].join(' ')
      
    console.log($scope.give)
  }

  function onpeople(data) {
    $scope.people = data
  }

  function oncaps(data) {
    $scope.caps = data
  }
    
  function withdrawCap(data) {
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
      person = $scope.people[give.peopleId]
    if (give.peopleId == null || give.capId == null || !give.reason) return
    person.caps.push({
      id: give.capId,
      reason: give.reason
    })

    $scope.caps[give.capId].owned = true


    $http.put('/people', {
        people: $scope.people,
        capId: give.capId
      }, {
        headers: { 'Content-Type': 'application/json' },
      }).success(function(msg) {
        if (!msg.ok) return false
        console.log('cap is given to some guy')
      })

    hideForm()
  }


})

app.directive('fileInput', [ '$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, els, attr, ctrl) {
      els.bind('change', function () {
        var el = els[0],
          files = el.files

        if (!files || !files.length) return

        $parse(attr.fileInput)
          .assign(scope, files[0])

        scope.$apply()
      })
    }
  }
}])

app.controller('ManageCtrl', function($scope, $http) {

  $http.get('data/people.json').success(onpeople)
  $http.get('data/caps.json').success(oncaps)

  // draw/edit/delete/add
  
  $scope.showForm = showForm
  $scope.submitCap = submitCap
  $scope.deleteCap = deleteCap

  resetForm()
  //dev()

  function dev() {
    $scope.cap.name = 'adsfasfs'
    $scope.formShown = true
  }

  function resetForm() {
    $scope.cap = {
      'name': '',
      'frontImg': null,
      'backImg': null
    }
    $scope.formShown = false
  }

  function onpeople(data) {
    $scope.people = data
  }

  function oncaps(data) {
    $scope.caps = data
  }
    
  function showForm() {
    $scope.formShown = true
  }

  function hideForm() {
    resetForm()
  }

  function deleteCap(id) {
    var id = id,
      delCap = _.clone($scope.caps[id])
    console.log(delCap)
    $http.delete('/caps/' + id).success(function (msg) {
      if (!msg.ok) return 
      
      delete $scope.caps[id]
    })
  }

  function submitCap() {
    var data = new FormData(),
      cap = $scope.cap

    angular.forEach(cap, function(value, key) {
      data.append(key, value)
    })

    $http.post('/caps', data, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    }).success(function (msg) {
      if (!msg.ok || !msg.cap) return 
      $scope.caps[msg.cap.id] = msg.cap
    })

  }


})

