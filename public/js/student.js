var module = angular.module('studentApp', []);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/homework', {
      templateUrl: '../Student/homeworks',
      controller: homeworkCtrl
    }).
    when('/stuComment/:homeworkname/:state', {
      templateUrl: '../../../Student/comment',
      controller: commentCtrl
    }).
    otherwise({
      redirectTo: '/homework'
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
      $scope.user = user;
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
  $scope.submithomework = {};
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
  $('.error').hide();
  setTimeout(function () {
    $scope.user = {};
    $scope.user.classname = $('#classname').text();
    $scope.user.username = $('#studentname').attr('ng-data-studentname');
    $http.post('/getAllHomeworks', $scope.user).
      success(function (allHomeworks) {
        $http.post('/getAllMyScopeAndRank', $scope.user).
          success(function (scopeAndRank){
            $('#container').highcharts({
              chart: {zoomType: 'xy'},
              title: {text: '成绩曲线柱状图'},
              subtitle: {text: ''},
              xAxis: [{
                  categories: ['作业1', '作业2', '作业3', '作业4', '作业5', '作业6',
                      '作业7', '作业8', '作业9', '作业10', '作业11', '作业12']
              }],
              yAxis: [{ // Primary yAxis
                  labels: {
                      format: '{value}名',
                      style: {color: '#89A54E'}
                  },
                  reversed: true,
                  title: {
                      text: '',
                      style: {color: '#89A54E'}
                  }
              }, { // Secondary yAxis
                  title: {
                      text: '',
                      style: {color: '#4572A7'}
                  },
                  labels: {
                      format: '{value} 分',
                      style: {color: '#4572A7'}
                  },
                  opposite: true
              }],
              tooltip: {shared: true},
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
                  data: scopeAndRank.grade,
                  tooltip: {valueSuffix: ' 分'}

              }, {
                  name: '名次',
                  color: '#89A54E',
                  type: 'spline',
                  data: scopeAndRank.rank,
                  tooltip: {valueSuffix: '名'}
              }]
            });
            $("text").eq($("text").length - 1).hide();
          }).error(function (err) {
            alert(err);
          });
        $('#container').parents('.span12').eq(0).addClass('score');
        $('text').eq($('text').length - 1).hide()
        $("#loading").text('');
        for (var i = 0; i < allHomeworks.length; i++) {
          var today = new Date();
          var starttime = $scope.getTime(allHomeworks[i].starttime);
          var endtime = $scope.getTime(allHomeworks[i].endtime);
          if (today > endtime) {
            allHomeworks[i].look = 'default';
            allHomeworks[i].state = 'end';
            allHomeworks[i].work = '';
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
          success(function (homeworkinfo) {
            var allHomeworks = $('.homework');
            for (var i = 0; i < allHomeworks.length; i++) {
              var thishomework = homeworkinfo[allHomeworks.eq(i).attr('ng-data-id')];
              allHomeworks.eq(i).find('.homework-img').eq(0).attr('src', thishomework.imglink);
            }
          }).error(function (err_res) {
            alert(err_res);
          });
      }).error(function (err_res) {
        alert(err_res);
      });
  }, 2000);
}

module.directive( "stuComment", ['$location', function($location) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        var homeworkname = element.parents('.panel').eq(0).find('.panel-title').eq(0).attr('ng-data-homeworkname');
        var state = element.parents('.panel').eq(0).find('.panel-title .label').eq(0).text();
        $location.path('/stuComment/' + homeworkname + '/' + state);
        scope.$apply();
      });
    }
  }
}]);

module.directive( "getHomeworkInfo", [function() {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        scope.submithomework.classname = $('#classname').text();
        scope.submithomework.homeworkname = element.parents('.panel').eq(0).find('.panel-title').eq(0).attr('ng-data-homeworkname');
        scope.submithomework.username = $("#studentname").attr('ng-data-studentname');
      });
    }
  }
}]);

module.directive( "submitHomework", ["$http", function($http) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        for (var key in scope.submithomework) {
          if (scope.submithomework.hasOwnProperty(key)) {
            validator.isFieldValid(key, scope.submithomework[key]);
          }
        }
        if (validator.isSubmitHomeworkValid()) {
          $http.post('/submitHomework', scope.submithomework).
            success(function () {
              $('.close').click();
              element.parents('.modal-content').find('.error').text('').hide();
              // 重新获取信息
              $http.post('/getStuHomeworkInfo', scope.user).
                success(function (homeworkinfo) {
                  var allHomeworks = $('.homework');
                  for (var i = 0; i < allHomeworks.length; i++) {
                    var thishomework = homeworkinfo[allHomeworks.eq(i).attr('ng-data-id')];
                    allHomeworks.eq(i).find('.homework-img').eq(0).attr('src', thishomework.imglink);
                  }
                }).error(function (err_res) {
                  alert(err_res);
                })
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

function commentCtrl($http, $scope, $routeParams) {
  $('#loading').hide();
  $("#see").show();
  $("#do").hide();
  $scope.user = {};
  $scope.user.classname = $('#classname').text();
  $scope.user.homeworkname = $routeParams.homeworkname;
  $scope.user.username = $('#studentname').attr('ng-data-studentname');
  $http.post('/getAllMyComments', $scope.user).
    success(function (allComments) {
      $scope.myComments = allComments;
    }).
    error(function (err_res) {
      alert(err_res);
    });
  if ($routeParams.state == 'end') {
    $('#doComment').hide();
  } else {
    $http.post('/getAllOthersComments', $scope.user).
    success(function (allOthersComments) {
      $scope.othersComments = allOthersComments;
    }).error(function (err_res) {
      if (err_res != "") alert(err_res);//好奇怪的alert
    });
  }
}


module.directive( "submitComment", ["$http", "$routeParams", function($http, $routeParams) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        var num = element.parents(".comment").eq(0).find(".input-score").eq(0).val();
        if (!isNaN(num) && parseInt(num) >= 0 && parseInt(num) <= 100 &&
            element.parents(".comment").eq(0).find(".input-text").eq(0).val() != "") {
            scope.submitC = {};
            scope.submitC.classname = $('#classname').text();
            scope.submitC.homeworkname = $routeParams.homeworkname;
            scope.submitC.username = $('#studentname').attr('ng-data-studentname');
            scope.submitC.commentuser = element.attr('ng-data-username');
            scope.submitC.grade = num;
            scope.submitC.comment = element.parents(".comment").eq(0).find(".input-text").eq(0).val();
            element.removeClass("btn-danger btn-success");
            $http.post('/submitComment', scope.submitC).
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
