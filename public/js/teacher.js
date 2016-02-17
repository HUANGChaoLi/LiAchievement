var module = angular.module('teacherApp', []);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/class', {
      templateUrl: '../teacher/class',
      controller: classCtrl
    }).
    when('/Ta/:classname', {
      templateUrl: '../../teacher/ta',
      controller: taCtrl
    }).
    when('/student/:classname', {
      templateUrl: '../../teacher/student',
      controller: studentCtrl
    }).
    when('/group/:classname', {
      templateUrl: '../../teacher/group',
      controller: groupCtrl
    }).
    when('/homework/:classname', {
      templateUrl: '../../teacher/homework',
      controller: homeworkCtrl
    }).
    otherwise({
      redirectTo: '/class'
    });
  $locationProvider.html5Mode(true);
}]);

module.service( 'currentClass', [ '$rootScope', '$http' , function( $rootScope, $http ) {
    var service = {
      class: {},
      changeClassname: function (newclassname) {
        service.class.classname = newclassname;
        $rootScope.$broadcast( 'currentClass.update' );
      },
      getClassname: function () {
        return service.class.classname;
      },
      getAdminname: function () {
        return service.class.adminname;
      }
    };
    service.class.adminname = $('#adminname').attr('ng-data-adminname');
    return service;
}]);

//单个班级操作

module.directive( "seeTa", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/Ta/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeStudent", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/student/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeGroup", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/group/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

module.directive( "editHomework", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/homework/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

$(function () {
  $('.error').hide();
});
