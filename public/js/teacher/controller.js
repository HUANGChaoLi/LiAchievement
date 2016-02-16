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

// 学生情况

function studentCtrl($scope, $http, $routeParams) {
  $scope.student = {};
  $scope.student.classname = $routeParams.classname;
  $('.error').hide();
  $http.post('/getAllStudents', $scope.student).
    success(function (allStudents) {
      $scope.Students = allStudents;
    }).error(function (err_res) {
      alert(err_res);
    });
}

module.directive( "getStudentname", [ function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.student.username = element.parents('tr').eq(0).find('td').eq(1).text();
        scope.$apply();
      });
    }
  }
}]);

module.directive( "removeStudentname", [ function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.student.username = '';
        scope.$apply();
      });
    }
  }
}]);

module.directive( "refleshStudents", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/getAllStudents', scope.student).
          success(function (allStudents) {
            scope.Students = allStudents;
            // callback();
          }).error(function (err_res) {
            alert(err_res);
            // callback(err_res);
          });
      });
    }
  }
}]);

module.directive( "addStudent", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.student) {
          if (scope.student.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.student[key]);
          }
        }
        if (validator.isStudentValid()) {
          $http.post('/addStudent', scope.student).
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

module.directive( "editStudent", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.student) {
          if (scope.student.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.student[key]);
          }
        }
        if (validator.isStudentValid()) {
          $http.post('/editStudent', scope.student).
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

module.directive( "deleteStudent", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.student) {
          if (scope.student.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.student[key]);
          }
        }
        if (validator.isDeleteStudentValid()) {
          $http.post('/deleteStudent', scope.student).
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

module.directive( "seeStudentTruename", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.student.username = element.parents('tr').eq(0).find('td').eq(1).text();
        scope.$apply();
        $http.post('/getUserInfo', scope.student).
          success(function (user) {
            element.text(user.truename);
          }).error(function (err) {
            element.text(err);
          });
      });
    }
  }
}]);

//组别情况

function groupCtrl($scope, $http, $routeParams) {
  $scope.class = {};
  $scope.class.classname = $routeParams.classname;
  $scope.Ta = {};
  $scope.Ta.classname = $routeParams.classname;
  $scope.student = {};
  $scope.student.classname = $routeParams.classname;
  $http.post('/getAllTAs', $scope.Ta).
    success(function (allTAs) {
      $scope.TAs = allTAs;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
  $http.post('/getAllStudents', $scope.student).
    success(function (allStudents) {
      $scope.Students = allStudents;
      // callback();
    }).error(function (err_res) {
      alert(err_res);
      // callback(err_res);
    });
}