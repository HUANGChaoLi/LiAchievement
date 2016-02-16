var module = angular.module('teacherApp', []);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/teacher/class', {
      templateUrl: './class',
      controller: classCtrl
    }).
    when('/teacher/Ta/:classname', {
      templateUrl: '../ta',
      controller: taCtrl
    }).
    when('/teacher/student/:classname', {
      templateUrl: '../student',
      controller: studentCtrl
    }).
    when('/teacher/group/:classname', {
      templateUrl: '../group',
      controller: groupCtrl
    }).
    otherwise({
      redirectTo: '/'
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


module.directive( "getClass", ['$location',  function($location) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/teacher/class')
        scope.$apply();
      });
    }
  }
}]);

module.directive( "getClassname", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        currentClass.changeClassname(element.parents('.panel').find('.panel-title').eq(0).attr('ng-data-classname'));
      });
    }
  }
}]);

module.directive( "removeClassname", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        currentClass.changeClassname('');
      });
    }
  }
}]);

//单个班级操作

module.directive( "seeTa", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/teacher/Ta/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeStudent", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/teacher/student/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

module.directive( "seeGroup", ['$location', 'currentClass', function($location, currentClass) {
  return {
    link: function( scope, element, attrs ) {
      element.bind( "click", function() {
        $location.path('/teacher/group/' + currentClass.getClassname());
        scope.$apply();
      });
    }
  }
}]);

$(function () {
  $('.error').hide();
});
