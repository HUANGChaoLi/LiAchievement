var module = angular.module('userApp', []);

module.service( 'Users', [ '$rootScope', '$http' , function( $rootScope, $http ) {
    var service = {
      users: [],

      getAllUsers: function ( callback ) {
        $http.get('/getAllUsers').
          success(function (allUsers) {
            service.users = allUsers;
            $rootScope.$broadcast( 'users.update' );
            // callback();
          }).error(function (err_res) {
            alert(err_res);
            // callback(err_res);
          });
      },

      addUser: function ( user, callback ) {
        $http.post('/regist', user).
          success(function (success_res) {
            $rootScope.$broadcast( 'users.update' );
            callback();
          }).error(function (err_res) {
            callback(err_res);
          });
      },

      deleteUser: function ( user, callback ) {
        $http.post('/deleteUser', user).
          success(function (success_res) {
            $rootScope.$broadcast( 'users.update' );
            callback();
          }).error(function (err_res) {
            callback(err_res);
          });
      },

      editUser: function ( user, callback ) {
        $http.post('/editUser', user).
          success(function (success_res) {
            $rootScope.$broadcast( 'users.update' );
            callback();
          }).error(function (err_res) {
            callback(err_res);
          });
      },

      editUserPassword: function ( user, callback ) {
        $http.post('/editUserPassword', user).
          success(function (success_res) {
            $rootScope.$broadcast( 'users.update' );
            callback();
          }).error(function (err_res) {
            callback(err_res);
          });
      }
   }
   return service;
}]);

module.controller( "Users.list", ['$scope', 'Users', function( $scope, Users ) {
  $scope.$on( 'users.update', function( event ) {
    $scope.users = Users.users;
    // $scope.$apply();
  });
  $scope.user = {};
  $scope.editUser = {};
  $scope.users = Users.users;
}]);

// 指令

module.directive( "valid", [function() {
  return {
    restrict: "A",
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


module.directive( "refleshUsers", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        Users.getAllUsers();
      });
    }
  }
}]);

module.directive( "addUser", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.user) {
          if (scope.user.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.user[key]);
          }
        }
        if (validator.isFormValid()) {
          Users.addUser(angular.copy(scope.user), function(err) {
            if (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            } else {
              $('#reflesh').click();
              $('.close').click();
              scope.user = {};
            }
          });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

module.directive( "deleteUser", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        if (validator.isUsernameValid(scope.editUser.username)) {
          Users.deleteUser(angular.copy(scope.editUser), function(err) {
            if (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            } else {
              $('#reflesh').click();
              $('.close').click();
              scope.editUser = {};
            }
          });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

module.directive( "editUser", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.editUser) {
          if (scope.editUser.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.editUser[key]);
          }
        }
        if (validator.isEditValid()) {
          Users.editUser(scope.editUser, function (err){
            if (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            } else {
              $('#reflesh').click();
              $('.close').click();
              scope.editUser = {};
            }
          });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

module.directive( "editUserPassword", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.editUser) {
          if (scope.editUser.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.editUser[key]);
          }
        }
        if (validator.isEditPasswordValid()) {
          Users.editUserPassword(scope.editUser, function (err){
            if (err) {
              element.parents('.modal-content').find('.error').text(err).show();
            } else {
              $('#reflesh').click();
              $('.close').click();
              scope.editUser = {};
            }
          });
        } else {
          element.parents('.modal-content').find('.error').text('请再次检查表单内容').show();
        }
      });
    }
  }
}]);

module.directive( "getUser", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.editUser.username = element.parents('tr').find('td').eq(1).text();
        scope.editUser.truename = element.parents('tr').find('td').eq(2).text();
        scope.editUser.email = element.parents('tr').find('td').eq(3).text();
        scope.editUser.limit = element.parents('tr').find('td').eq(4).text();
        scope.$apply();
      });
    }
  }
}]);

module.directive( "getUsername", [ 'Users', function( Users ) {
  return {
    restrict: "A",
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.editUser.username = element.parents('tr').find('td').eq(1).text();
        scope.$apply();
      });
    }
  }
}]);

module.directive( "getInfo", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/getUserInfo', scope.editUser).
          success(function (user) {
            user.classname = user.classname ? user.classname : '无';
            user.group = user.group ? user.group : '无';
            element.text('班：' + user.classname + '； 组：' + user.group);
          }).error(function (err) {
            element.text(err);
          });
      });
    }
  }
}]);


$(function (){
  $('.modal-content .error').hide();
  $('#reflesh').click();
})