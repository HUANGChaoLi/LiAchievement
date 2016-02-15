module.controller( "mainClassCtrl", ['$scope', 'currentClass', function( $scope, currentClass ) {
  $scope.$on( 'currentClass.update', function( event ) {
    $scope.class = currentClass.class;
    $scope.$apply();
  });
}]);

function classCtrl($scope, $http, currentClass) {
  $('.error').hide();
  $scope.$on( 'currentClass.update', function( event ) {
    $scope.class = currentClass.class;
    $scope.$apply();
  });
  $http.get('/getAllUsers').
    success(function (allUsers) {
      $scope.users = allUsers;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}

function taCtrl($scope, $http, $routeParams) {
  $scope.classname = $routeParams.classname;
  $('.error').hide();
  $http.get('/getAllUsers').
    success(function (allUsers) {
      $scope.users = allUsers;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}

function studentCtrl($scope, $http, $routeParams) {
  $scope.classname = $routeParams.classname;
  $('.error').hide();
  $http.get('/getAllUsers').
    success(function (allUsers) {
      $scope.users = allUsers;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}