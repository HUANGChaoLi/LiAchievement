$(function () {
    $("#signin").click(function(){
        $('.signin-wrapper').eq(0).removeClass("hide");
    });

    $(".form-after").click(function(){
        $('.signup-wrapper').addClass("hide");
        $('.error').hide();
    });

    $(".input input").blur(function (){
        var field = $(this).attr("name");
        if (!validator.isFieldValid(field, $(this).val())) {
            $(this).parent().find(".error").text(validator.getErrorMessage(field)).show();
        } else {
            $(this).parent().find(".error").text("").hide();
        }
    });

    $("form").submit(function (e) {
        e.preventDefault();
        $(this).find(".input input").blur();
        if (!validator.form.username.status || !validator.form.password.status) {
            return false;
        } else {
            var user = {};
            user.username = $("#username").val();
            user.password = $("#password").val();
            $.post('/', user, function (data) {
                if (data == "") {
                    location.reload();
                } else {
                    $(".error").text(data).show();
                }
            });
        }
    });

    $("[type=reset]").click(function(e){
        e.preventDefault();
        $(this).parents("form").find(".input input").val("");
    });

    var pictrueindex = 0;

    $("#rightpictrue").click(function (e) {
        pictrueindex =( (pictrueindex + 1) % 8)
        $(".body-wrapper").css("background", "url(../images/background" + pictrueindex + ".jpg)");
    });

    $("#leftpictrue").click(function (e) {
        pictrueindex =( (pictrueindex - 1) % 8)
        if (pictrueindex < 0) { pictrueindex = 7; }
        $(".body-wrapper").css("background", "url(../images/background" + pictrueindex + ".jpg)");
    });

    $(".error").show();
    $(".body-wrapper").css("height", $(document).height() - 1);
    $(".form-after").click();
});
