module.controller( "mainClassCtrl", ['$scope', 'currentClass', function( $scope, currentClass ) {
  $scope.$on( 'currentClass.update', function( event ) {
    $scope.class = currentClass.class;
    $scope.$apply();
  });
  $scope.editUser = {};
  $scope.editUser.username = $('#adminname').attr('ng-data-adminname');
}]);

function classCtrl($scope, $http, currentClass) {
  $('.error').hide();
  $scope.$on( 'currentClass.update', function( event ) {
    $scope.class = currentClass.class;
    $scope.$apply();
  });
  $http.post('/getAllClasses', currentClass.class).
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

module.directive( "refleshClass", ['$http', 'currentClass',  function($http, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/getAllClasses', currentClass.class).
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

module.directive( "addClass", ['$http', 'currentClass', function($http, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.class.adminname = currentClass.getAdminname();
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

module.directive( "deleteClass", ['$http', 'currentClass',  function($http, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.class.adminname = currentClass.getAdminname();
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
  $scope.Ta = {};
  $scope.Ta.classname = $routeParams.classname;
  $('.error').hide();
  $http.post('/getAllTAs', $scope.Ta).
    success(function (allTAs) {
      $scope.TAs = allTAs;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}

module.directive( "refleshTa", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/getAllTAs', scope.Ta).
          success(function (allTAs) {
            scope.TAs = allTAs;
            // callback();
          }).error(function (err_res) {
            alert(err_res);
            // callback(err_res);
          });
      });
    }
  }
}]);

module.directive( "addTa", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.Ta) {
          if (scope.Ta.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.Ta[key]);
          }
        }
        if (validator.isTaValid()) {
          $http.post('/addTa', scope.Ta).
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

module.directive( "editTa", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.Ta) {
          if (scope.Ta.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.Ta[key]);
          }
        }
        if (validator.isTaValid()) {
          $http.post('/editTa', scope.Ta).
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

module.directive( "deleteTa", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.Ta) {
          if (scope.Ta.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.Ta[key]);
          }
        }
        if (validator.isDeleteTaValid()) {
          $http.post('/deleteTa', scope.Ta).
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

module.directive( "getUsername", [ function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.Ta.username = element.parents('tr').eq(0).find('td').eq(1).text();
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeTruename", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.Ta.username = element.parents('tr').eq(0).find('td').eq(1).text();
        scope.$apply();
        $http.post('/getUserInfo', scope.Ta).
          success(function (user) {
            element.text(user.truename);
          }).error(function (err) {
            element.text(err);
          });
      });
    }
  }
}]);

module.directive( "removeUsername", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.Ta.username = scope.Ta.group = '';
        scope.$apply();
      });
    }
  }
}]);

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