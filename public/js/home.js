$(function () {

    $("#signup").click(function(){
        $('#signupForm').removeClass("hide");
    });

    $("#signin").click(function(){
        $('#signinForm').removeClass("hide");
    });

    $("#account").click(function(){
        $('#accountForm').removeClass("hide");
    })

    $(".form-after").click(function(){
        $('.signup-wrapper').addClass("hide");
        $('.error').hide();
    });

    //注册状态
    $("#signupForm .input input").blur(function (){
        var field = $(this).attr("name");
        var self = $(this);
        if (!validator.isFieldValid(field, $(this).val())) {
            $(this).parent().find(".error").text(validator.getErrorMessage(field)).show();
        } else {
            $(this).parent().find(".error").text("").hide();
            if (field != "password" && field != "rePassword") {
                $.post("uniqueCheck", {attrbute: field, value: self.val()}, function (data){
                    if (data != "") {
                        self.parent().find(".error").text(data).show();
                        validator.form[field].status = false;
                    } else {
                        self.parent().find(".error").text("").hide();
                    }
                });
            }
        }
    });

    //登陆状态
    $("#signinForm .input input").blur(function (){
        var field = $(this).attr("name");
        var self = $(this);
        if (!validator.isFieldValid(field, $(this).val())) {
            $(this).parent().find(".error").text(validator.getErrorMessage(field)).show();
        } else {
            $(this).parent().find(".error").text("").hide();
            if (field != "password") {
                $.post("uniqueCheck", {attrbute: field, value: self.val()}, function (data){
                        if (data == "") {
                            self.parent().find(".error").text("用户不存在").show();
                            validator.form[field].status = false;
                        } else {
                            self.parent().find(".error").text("").hide();
                        }
                    });
            }
        }
    });

    $("[type=reset]").click(function (e){
        e.preventDefault();
        $(this).parents("form").find(".input input").val("");
    });

    $(".edit-after").click(function () {
        $(".edit").hide();
    });

    $("#logout").click(function (){
        $.post("logout", {info: "logout"}, function (data){
            $("#accountButton").hide();
            $(".edit").hide();
            $("#blogDetail").hide();
            $('#index-wrapper').show();
            $("#signinForm").removeClass("hide");
            $("#signinForm").find(".input input").val("");
            $("#accountForm").find("input").val("");
            $("#signupForm").find(".input input").val("");
        });
    });

    // 初始化
    $("#accountButton").hide();
    $(".edit").hide();
    $("#blogDetail").hide();
    angular.bootstrap(angular.element("#allBlog"), ["blogApp"]);//启动blogapp
    $(".page").eq(1).click();
    if ($("#accountForm input").eq(0).val() != "") {
        $('#index-wrapper').hide();
        $("#accountButton").show();
        $("#signupForm").addClass("hide");
        $("#signinForm").addClass("hide");
        $("#blogDetail").show();
        $("#flush").click();
    }


// search 样式变换，不知道为什么用angular的ng-blur哈ng-focus不行
    $(".search").focus(function(){
      $("#search").addClass("focus_search");
    });
    $(".search").blur(function(){
      $("#search").removeClass("focus_search");
    });
});
