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
  $http.get('/getAllClasses').
    success(function (allClasses) {
      $scope.classes = allClasses;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}

module.directive( "valid", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "blur", function() {
        if (!validator.isFieldValid(element.attr('name'), element.val())) {
          element.parents('.modal-content').find('.error').text(validator.getErrorMessage(element.attr('name'))).show();
        } else {
          element.parents('.modal-content').find('.error').text('').hide();
        }
      });
    }
  }
}]);

module.directive( "refleshClass", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.get('/getAllClasses').
          success(function (allClasses) {
            scope.classes = allClasses;
            // callback();
          }).error(function (err_res) {
            alert(err_res);
            // callback(err_res);
          });
      });
    }
  }
}]);

module.directive( "addClass", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.class.adminname = $('#adminname').val();
        for (var key in scope.class) {
          if (scope.class.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.class[key]);
          }
        }
        if (validator.isClassValid()) {
          $http.post('/addClass', scope.class).
            success(function () {
              $('#reflesh').click();
              $('.close').click();
              element.parents('.modal-content').find('.error').text('').hide();
            }).error(function (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

module.directive( "deleteClass", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.class.adminname = $('#adminname').val();
        for (var key in scope.class) {
          if (scope.class.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.class[key]);
          }
        }
        if (validator.isClassValid()) {
          $http.post('/deleteClass', scope.class).
            success(function () {
              $('#reflesh').click();
              $('.close').click();
              element.parents('.modal-content').find('.error').text('').hide();
            }).error(function (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

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