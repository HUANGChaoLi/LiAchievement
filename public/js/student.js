var module = angular.module('studentApp', []);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/stuComment/:homeworkname', {
      templateUrl: '../../student/comment',
      controller: commentCtrl
    }).
    when('/', {
      templateUrl: '../student/homeworks',
      controller: homeworkCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);

module.controller( "mainStudentCtrl", ['$scope', '$http', function( $scope, $http ) {
  $scope.editUser = {};
  $scope.editUser.username = $('#studentname').attr('ng-data-studentname');
  $('.error').hide();
  $http.post('/getUserInfo', $scope.editUser).
    success(function (user) {
      $('#studentname').text(user.username);
      $('#group').text("group" + user.group);
      $('#studentTruename').html(user.truename + "<span class=\'caret\'></span>");
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
    $scope.user.username = $('#studentname').attr('ng-data-studentname');
    $http.post('/getAllHomeworks', $scope.user).
      success(function (allHomeworks) {
        $('#container').highcharts({
          chart: {
              zoomType: 'xy'
          },
          title: {
              text: '成绩曲线柱状图'
          },
          subtitle: {
              text: ''
          },
          xAxis: [{
              categories: ['作业1', '作业2', '作业3', '作业4', '作业5', '作业6',
                  '作业7', '作业8', '作业9', '作业10', '作业11', '作业12']
          }],
          yAxis: [{ // Primary yAxis
              labels: {
                  format: '{value}名',
                  style: {
                      color: '#89A54E'
                  }
              },
              reversed: true,
              title: {
                  text: '',
                  style: {
                      color: '#89A54E'
                  }
              }
          }, { // Secondary yAxis
              title: {
                  text: '',
                  style: {
                      color: '#4572A7'
                  }
              },
              labels: {
                  format: '{value} 分',
                  style: {
                      color: '#4572A7'
                  }
              },
              opposite: true
          }],
          tooltip: {
              shared: true
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 120,
              verticalAlign: 'top',
              y: 50,
              floating: true,
              backgroundColor: '#FFFFFF'
          },
          series: [{
              name: '分数',
              color: '#4572A7',
              type: 'column',
              yAxis: 1,
              data: [66, 71.5, 78, 78, 99, 100, 96.6, 98.5, 96.4, 94.1, 95.6, 94.4],
              tooltip: {
                  valueSuffix: ' 分'
              }

          }, {
              name: '名次',
              color: '#89A54E',
              type: 'spline',
              data: [7, 6, 9, 11, 12, 22, 2, 21, 2, 1, 11, 6],
              tooltip: {
                  valueSuffix: '名'
              }
          }]
        });
        $('text').eq($('text').length - 1).hide()
        for (var i = 0; i < allHomeworks.length; i++) {
          $("#loading").text('');
          var today = new Date();
          var starttime = $scope.getTime(allHomeworks[i].starttime);
          var endtime = $scope.getTime(allHomeworks[i].endtime);
          if (today > endtime) {
            allHomeworks[i].look = 'default';
            allHomeworks[i].state = 'end';
            allHomeworks[i].work = '源文件';
            allHomeworks[i].comment = '查看评审';
          } else if (today > starttime) {
            allHomeworks[i].look = 'info';
            allHomeworks[i].state = 'present';
            allHomeworks[i].work = '提交作业';
            allHomeworks[i].comment = '查看评审';
          } else {
            allHomeworks[i].look = 'success';
            allHomeworks[i].state = 'future';
            allHomeworks[i].work = '';
            allHomeworks[i].comment = '';
          }
        }
        $scope.homeworks = allHomeworks;
        //找该用户所有作业的信息
        $http.post('/getStuHomeworkInfo', $scope.user).
          success(function (homeworkinfo) {//写个服务把所有信息存储起来；未完成
            var allHomeworks = $('.homework');
            for (var i = 0; i < allHomeworks.length; i++) {
              var thishomework = homeworkinfo[allHomeworks.eq(i).attr('ng-data-id')];
              allHomeworks.eq(i).find('.homework-img').eq(0).attr('src', thishomework.imglink);
            }
          }).error(function (err_res) {
            alert(err_res);
          })
      }).error(function (err_res) {
        alert(err_res);
      });
  }, 100);
}

function commentCtrl($http, $scope) {
  $('#loading').hide();
  $("#see").show();
  $("#do").hide();
}

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
