// Defining a module

angular.module('userApp', []);

angular.module('userApp')
  .controller('signupCtrl', function ($scope, $http) {
    $scope.user = {};
    $scope.submit = function (dom) {
      var thisDom = angular.element(dom);
      thisDom.find(".input input").blur();
      if (validator.isFormValid()) {
        $http.post('/regist', $scope.user).
          success(function (success_res) {
            $('#index-wrapper').hide();
            $("#accountButton").show();
            $("#signupForm").addClass("hide");
            $("#signinForm").addClass("hide");
            $("#blogDetail").show();
            $("#flush").click();
            setAccout(success_res);
          }).error(function (err_res) {
            alert("regist fail! try again.");
          });
      } else {
        alert("请再仔细检查输入是否不符合规范或者某一项是否冲突！");
      }
    }
  });

angular.module('userApp')
  .controller('signinCtrl', function ($scope, $http) {
    $scope.user = {};

    $scope.submit = function (dom) {
      var thisDom = angular.element(dom);
      thisDom.find(".input input").blur();
      if (validator.isSigninValid()) {
        $http.post('/signin', $scope.user).
          success(function (success_res) {
            $('#index-wrapper').hide();
            $("#accountButton").show();
            $("#signupForm").addClass("hide");
            $("#signinForm").addClass("hide");
            $("#blogDetail").show();
            setAccout(success_res);
            $("#flush").click();
          }).error(function (err_res) {
            $("#signinForm .error").text(err_res).show();
          });
      } else {
        alert("请再仔细检查是否是该用户名，或者密码是否有误！");
      }
    }
    
  });

angular.module('blogApp', []);

angular.module('blogApp')
  .controller('blogCtrl', function ($scope, $http) {

    $scope.Blogs = [];
    $scope.isAdmin = false;
    $scope.adminName = null;
    $scope.pageLen = 1;
    $scope.pageNum = [1];
    $scope.pageScope = 1;
    $scope.showEveryPage = 4;

    $scope.getAccountName = function () {
      return $("#accountForm form .input input").eq(0).val();
    }

    $scope.getBlogId = function (dom) {
      return dom.attr("ng-data-id") - 0;
    }

    $scope.getCommentId = function (dom) {
      return dom.attr("ng-data-id") - 0;
    }

    $scope.addBlog = function () {
      $scope.paragraph = $scope.titles = "";
      $(".edit").hide();
      $("#addBlog").show();
    }
    $scope.editBlog = function (dom) {
      var thisDom = angular.element(dom);
      var accout = $scope.getAccountName();
      if (accout == thisDom.text()) {
        $scope.blogId = $scope.getBlogId(thisDom);
        $(".edit").hide();
        $scope.titles = thisDom.parents(".blog").find(".blogH").eq(0).text();
        $scope.paragraph = thisDom.parent().find(".blogP").eq(0).text();
        $("#editBlog").show();
      }
    }
    $scope.editComment = function (dom) {
      var thisDom = angular.element(dom);
      var accout = $scope.getAccountName();
      if (thisDom.text() == accout) {
        $scope.commentId = $scope.getCommentId(thisDom);
        $scope.blogId = $scope.getBlogId(thisDom.parents(".blog").eq(0).find(".Creator").eq(0));
        $(".edit").hide();
        $scope.paragraph = thisDom.parent().find(".blogP").eq(0).text();
        $("#editComment").show();
      }
    }
    $scope.addComment = function (dom) {
      var thisDom = angular.element(dom);
      $scope.blogId = $scope.getBlogId(thisDom.parents(".blog").eq(0).find(".Creator").eq(0));
      $(".edit").hide();
      $scope.paragraph = $scope.titles = "";
      $("#addComment").show();
    }
    // 处理样式mouseover
    $scope.creatorMouse = function (dom) {
      var thisDom = angular.element(dom);
      var accout = $scope.getAccountName();
      if (accout == thisDom.text()) {
        thisDom.addClass("CreatorHover");
      }
    }
    $scope.commentMouse = function (dom) {
      var thisDom = angular.element(dom);
      var accout = $scope.getAccountName();
      if (accout == thisDom.text()) {
        thisDom.addClass("commentUserHover");
      }
    }

    // page函数

    $scope.pageClick = function (dom) {
      var thisDom = angular.element(dom);
      $(".page").removeClass("page_active");
      var pageScope = thisDom.text();
      if (pageScope == "<" && $scope.pageScope != 1) {
        $scope.pageScope--;
      } else if (pageScope == ">" && $scope.pageScope != $scope.pageNum[$scope.pageNum.length - 1]) {
        $scope.pageScope++;
      } else if (pageScope != "<" && pageScope != ">") {
        $scope.pageScope = pageScope - 0;
      }
      $(".page").eq($scope.pageScope).addClass("page_active");
    }

    $scope.checkPage = function (index) {
      return Math.ceil((index + 1) / $scope.showEveryPage) == $scope.pageScope;
    }

    // 与后台交流函数
    $scope.flush = function () {
      $http.get('/data/Blogs').
        success(function(data, status, headers, config) {
          $scope.Blogs = data;
          $scope.pageLen = (data.length == 0 ? 1 : Math.ceil(data.length / $scope.showEveryPage));
          $scope.pageNum = [];
          for (var i = 1; i <= $scope.pageLen; i++) $scope.pageNum.push(i);
          if (!$scope.adminName) {
            $http.get('/data/AdminName').
              success(function(data, status, headers, config) {
                $scope.adminName = data;
                $scope.isAdmin = ($scope.adminName == $scope.getAccountName());
              });
          } else {
            $scope.isAdmin = ($scope.adminName == $scope.getAccountName());
          }
        });
    }
    $scope.add_comment = function () {
      if ($scope.paragraph == "") {
        alert("请输入Comment内容");
        return;
      }
      $http.post('/data/addComment', {blog_id: $scope.blogId, username: $scope.getAccountName(), contents: $scope.paragraph}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("add_comment fail! try again.");
        });
    }
    $scope.edit_blog = function () {
      if ($scope.paragraph == "") {
        alert("请输入Blog内容");
        return;
      } else if ($scope.titles == "") {
        alert("请输入Blog标题");
        return;
      }
      $http.post('/data/editBlog', {blog_id: $scope.blogId, title: $scope.titles, contents: $scope.paragraph}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("edit_blog fail! try again.");
        });
    }
    $scope.delete_blog = function () {
      $http.post('/data/deleteBlog', {blog_id: $scope.blogId}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("delete_blog fail! try again.");
        });
    }
    $scope.add_blog = function () {
      if ($scope.paragraph == "") {
        alert("请输入Blog内容");
        return;
      } else if ($scope.titles == "") {
        alert("请输入Blog标题");
        return;
      }
      $http.post('/data/addBlog', {blog_id: $scope.blogId, username: $scope.getAccountName(), title: $scope.titles, contents: $scope.paragraph}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("add_blog fail! try again.");
        });
    }
    $scope.edit_comment = function () {
      if ($scope.paragraph == "") {
        alert("请输入Comment内容");
        return;
      }
      $http.post('/data/editComment', {blog_id: $scope.blogId, comment_id: $scope.commentId, contents: $scope.paragraph}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("edit_comment fail! try again.");
        });
    }
    $scope.delete_comment = function () {
      $http.post('/data/deleteComment', {blog_id: $scope.blogId, comment_id: $scope.commentId}).
        success(function (success_res) {
          $scope.flush();
          $(".edit").hide();
        }).error(function (err_res) {
          alert("delete_comment fail! try again.");
        });
    }
    // 管理员函数
    $scope.lockBlog = function (dom) {
      var thisDom = angular.element(dom).parents(".Creator").eq(0);
      $scope.blogId = $scope.getBlogId(thisDom);
      $http.post('/data/lockBlog', {blog_id: $scope.blogId}).
        success(function (success_res) {
          $scope.flush();
        }).error(function (err_res) {
          alert("lockBlog fail! try again.");
        });
    }
    $scope.unlockBlog = function (dom) {
      var thisDom = angular.element(dom).parents(".Creator").eq(0);
      $scope.blogId = $scope.getBlogId(thisDom);
      $http.post('/data/unlockBlog', {blog_id: $scope.blogId}).
        success(function (success_res) {
          $scope.flush();
        }).error(function (err_res) {
          alert("unlockBlog fail! try again.");
        });
    }
    $scope.lockComment = function (dom) {
      var thisDom = angular.element(dom).parents(".commentUser").eq(0);
      $scope.commentId = $scope.getCommentId(thisDom);
      $scope.blogId = $scope.getBlogId(thisDom.parents(".blog").eq(0).find(".Creator").eq(0));
      $http.post('/data/lockComment', {blog_id: $scope.blogId, comment_id: $scope.commentId}).
        success(function (success_res) {
          $scope.flush();
        }).error(function (err_res) {
          alert("lockComment fail! try again.");
        });
    }
    $scope.unlockComment = function (dom) {
      var thisDom = angular.element(dom).parents(".commentUser").eq(0);
      $scope.commentId = $scope.getCommentId(thisDom);
      $scope.blogId = $scope.getBlogId(thisDom.parents(".blog").eq(0).find(".Creator").eq(0));
      $http.post('/data/unlockComment', {blog_id: $scope.blogId, comment_id: $scope.commentId}).
        success(function (success_res) {
          $scope.flush();
        }).error(function (err_res) {
          alert("unlockComment fail! try again.");
        });
    }
  });

function setAccout(user) {
  var accoutInput = $("#accountForm").find("input");
  accoutInput.eq(0).val(user.username);
  accoutInput.eq(1).val(user.sid);
  accoutInput.eq(2).val(user.phone);
  accoutInput.eq(3).val(user.email);
}
