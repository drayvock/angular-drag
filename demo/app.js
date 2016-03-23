var app = angular.module('app', ['ui-drag'])
.controller('mainCtrl', function($scope){ 
  $scope.windowRestrict = angular.element(window)[0];
  $scope.greenRestrict = document.getElementsByClassName("app")[0];  
});