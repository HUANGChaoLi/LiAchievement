var module = angular.module('taApp', []);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: './TA/homeworks',
      controller: homeworkCtrl
    }).
    when('/groupDistribute/:homeworkname', {
      templateUrl: '../../TA/distribute',
      controller: distributeCtrl
    }).
    when('/homeworkComment/:homeworkname', {
      templateUrl: '../../TA/comment',
      controller: commentCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);

module.controller( "mainTaCtrl", ['$scope', '$http', function( $scope, $http ) {
  $scope.editUser = {};
  $scope.editUser.username = $('#taname').attr('ng-data-taname');
  $('.error').hide();
  $http.post('/getUserInfo', $scope.editUser).
    success(function (user) {
      $('#taname').text(user.username);
      $('#taTruename').html(user.truename + "<span class=\'caret\'></span>");
      $('#classname').text(user.classname);
    }).error(function (err) {
      alert(err);
    });
}]);

module.directive( "editUserPassword", ['$http',  function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/changePassword', scope.editUser).
          success(function (allClasses) {
            $('.close').click();
            scope.editUser.oldPassword = '';
          }).error(function (err) {
            element.parents('.modal-content').find('.error').text(err).show();
          });
      });
    }
  }
}]);

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

function homeworkCtrl($http, $scope) {
  $scope.getTime = function (Time) {
    if (!(/^[0-9]{4}:[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(Time))) {
      return null;
    } else {
      var numarr = Time.split(':');
      var hour = numarr.pop();
      var time = new Date(numarr.join(','));
      time.setHours(hour);
      if (time == 'Invalid Date') return null;
      else return time;
    }
  }
  setTimeout(function () {
    $scope.user = {};
    $scope.user.classname = $('#classname').text();
    $scope.user.username = $('#taname').attr('ng-data-taname');
    $http.post('/getAllHomeworks', $scope.user).
      success(function (allHomeworks) {
        $("#loading").hide();
        for (var i = 0; i < allHomeworks.length; i++) {
          var today = new Date();
          var starttime = $scope.getTime(allHomeworks[i].starttime);
          var endtime = $scope.getTime(allHomeworks[i].endtime);
          if (today > endtime) {
            allHomeworks[i].look = 'default';
            allHomeworks[i].state = 'end';
            allHomeworks[i].enDistribute = 'disabled';
          } else if (today > starttime) {
            allHomeworks[i].look = 'info';
            allHomeworks[i].state = 'present';
            allHomeworks[i].enComment = 'disabled';
          } else {
            allHomeworks[i].look = 'success';
            allHomeworks[i].state = 'future';
            allHomeworks[i].enComment = 'disabled';
          }
        }
        $scope.homeworks = allHomeworks;
      }).error(function (err_res) {
        alert(err_res);
      });
  }, 2000);
}

module.directive( "groupDistribute", ['$location', function($location) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        if (!element.hasClass('disabled')) {
          $location.path('/groupDistribute/' + element.parents('.panel').eq(0).find('.panel-title').eq(0).attr('ng-data-homeworkname'));
          scope.$apply();
        }
      });
    }
  }
}]);

module.directive( "homeworkComment", ['$location', function($location) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        if (!element.hasClass('disabled')) {
          $location.path('/homeworkComment/' + element.parents('.panel').eq(0).find('.panel-title').eq(0).attr('ng-data-homeworkname'));
          scope.$apply();
        }
      });
    }
  }
}]);

function distributeCtrl($scope, $http, $routeParams) {
  $scope.group = {};
  $scope.group.classname = $('#classname').text();
  $scope.group.homeworkname = $routeParams.homeworkname;
  $('.error, #loading').hide();
  $http.post('/getAllGroups', $scope.group).
    success(function (allGroups) {
      $scope.Groups = allGroups;
    }).error(function (err_res) {
      alert(err_res);
    });
}

module.directive( "refleshGroup", ['$http', function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $http.post('/getAllGroups', scope.group).
          success(function (allGroups) {
            scope.Groups = allGroups;
          }).error(function (err_res) {
            alert(err_res);
          });
      });
    }
  }
}]);

module.directive( "addGroup", ['$http', function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.group) {
          if (scope.group.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.group[key]);
          }
        }
        if (validator.isAddGroupValid()) {
          $http.post('/addGroup', scope.group).
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

module.directive( "deleteGroup", ['$http', function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.group) {
          if (scope.group.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.group[key]);
          }
        }
        if (validator.isDeleteGroupValid()) {
          $http.post('/deleteGroup', scope.group).
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

module.directive( "getGroupInfo", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.group.reviewgroup = element.parents('tr').eq(0).find('td').eq(1).text();
        scope.group.reviewedgroup = element.parents('tr').eq(0).find('td').eq(2).text();
        scope.$apply();
      });
    }
  }
}]);

function commentCtrl($http, $scope, $routeParams) {
  $('#loading').hide();
  $scope.homework = {};
  $scope.homework.homeworkname = $routeParams.homeworkname;
  $scope.homework.classname = $("#classname").text();
  $http.post('/getAllTaComments', $scope.homework).
    success(function (allTaComments) {
      $scope.allComments = allTaComments;
    }).error(function (err) {
      alert(err);
    });
}

module.directive( "submitTaComment", ["$http", "$routeParams", function($http, $routeParams) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        var num = element.parents(".comment").eq(0).find(".input-score").eq(0).val();
        if (!isNaN(num) && parseInt(num) >= 0 && parseInt(num) <= 100 &&
            element.parents(".comment").eq(0).find(".input-text").eq(0).val() != "") {
            scope.submitC = {};
            scope.submitC.classname = $('#classname').text();
            scope.submitC.homeworkname = $routeParams.homeworkname;
            scope.submitC.commentuser = element.attr('ng-data-username');
            scope.submitC.grade = num;
            scope.submitC.comment = element.parents(".comment").eq(0).find(".input-text").eq(0).val();
            element.removeClass("btn-danger btn-success");
            $http.post('/submitTaComment', scope.submitC).
              success(function () {
                element.removeClass("btn-warning");
                element.addClass("btn-success");
              }).error(function (err) {
                element.addClass("btn-danger");
                alert(err);
              });
        } else {
          alert("请输入正确的成绩和评论");
        }
      });
    }
  }
}]);

module.directive( "stuComment", ['$location', function($location) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        var homeworkname = element.parents('.panel').eq(0).find('.panel-title').eq(0).attr('ng-data-homeworkname');
        $location.path('/stuComment/' + homeworkname);
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeComment", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        element.parents('.nav-tabs').eq(0).find('li').removeClass('active');
        element.parents('li').addClass('active');
        $("#see").show();
        $("#do").hide();
      });
    }
  }
}]);

module.directive( "doComment", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        element.parents('.nav-tabs').eq(0).find('li').removeClass('active');
        element.parents('li').addClass('active');
        $("#see").hide();
        $("#do").show();
      });
    }
  }
}]);
