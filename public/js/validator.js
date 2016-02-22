var validator = {
  form: {
    username: {
      status: false,
      errorMessage: '请输入正确的用户名'
    },
    password: {
      status: false,
      errorMessage: '密码为6~12位数字、大小写字母、中划线、下划线'
    }, 
    rePassword: {
      status: false,
      errorMessage: '密码不一致'
    }, 
    oldPassword: {
      status: false,
      errorMessage: '密码为6~12位数字、大小写字母、中划线、下划线'
    }, 
    truename: {
      status: false,
      errorMessage: '请输入正确的姓名'
    },
    email: {
      status: false,
      errorMessage: '请输入合法邮箱'
    },
    limit: {
      status: false,
      errorMessage: '请选择权限'
    },
    classname: {
      status: false,
      errorMessage: '请输入正确的班级名称'
    },
    adminname: {
      status: false,
      errorMessage: '请输入正确的管理员名称'
    },
    stuGroup: {
      status: false,
      errorMessage: '请输入大约零的一位数字'
    },
    homeworkname: {
      status: false,
      errorMessage: '请输入正确的作业名称'
    },
    link: {
      status: false,
      errorMessage: '请输入正确格式的链接'
    },
    githublink: {
      status: false,
      errorMessage: '请输入正确格式的github链接'
    },
    starttime: {
      status: false,
      errorMessage: '请输入以下格式的时间(年:月:日:时),而且时间要晚于当前时间'
    },
    endtime: {
      status: false,
      errorMessage: '请输入以下格式的时间(年:月:日:时),而且时间要晚于开始时间'
    },
    reviewgroup: {
      status: false,
      errorMessage: '请输入一个大于零的数字'
    },
    reviewedgroup: {
      status: false,
      errorMessage: '请输入一个大于零的数字,且与评论组的数字不相同'
    }
  }, 

  isReviewgroupValid: function (reviewgroup){
    this.Reviewgroup = reviewgroup;
    return this.form.reviewgroup.status = (!isNaN(reviewgroup) && (parseInt(reviewgroup) > 0));
  }, 

  isReviewedgroupValid: function (reviewedgroup){
    return this.form.reviewedgroup.status = ((reviewedgroup != this.Reviewgroup) && !isNaN(reviewedgroup) && (parseInt(reviewedgroup) > 0));
  }, 

  isHomeworknameValid: function (homeworkname){
    return this.form.homeworkname.status = (homeworkname != "");
  }, 

  isLinkValid: function (link){
    // return this.form.link.status = /^http:\/\/*/.test(link);
    return this.form.link.status = link != '';
  }, 

  isGithublinkValid: function (githublink){
    // return this.form.link.status = /^http:\/\/*/.test(link);
    return this.form.githublink.status = githublink != '';
  }, 

  isTimeValid: function (Time){
    var result = /^[0-9]{4}:[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(Time);
    if (result) {
      var numarr = Time.split(':');
      var hour = numarr.pop();
      var time = new Date(numarr.join(','));
      time.setHours(hour);
      if (time == 'Invalid Date') result = false;
    }
    return result;
  }, 

  isStarttimeValid: function (starttime){
    return this.form.starttime.status = this.isTimeValid(starttime);
  }, 

  isEndtimeValid: function (endtime){
    return this.form.endtime.status = this.isTimeValid(endtime);
  }, 

  isUsernameValid: function (username){
    return this.form.username.status = (username != "");
  },

  isPasswordValid: function (password){
    this.passwords = password;
    return this.form.password.status = /^[a-zA-Z0-9\-\_]{6,12}$/.test(password);
  },

  isOldPasswordValid: function (oldpassword){
    return this.form.password.status = /^[a-zA-Z0-9\-\_]{6,12}$/.test(oldpassword);
  },

  isRePasswordValid: function (rePassword){
    return this.form.rePassword.status = (this.passwords == rePassword);
  },

  isTruenameValid: function (truename){
    return this.form.truename.status = (truename != "");
  },

  isEmailValid: function (email){
    return this.form.email.status = /^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isLimitValid: function (limit){
    return this.form.limit.status = (limit == "老师" || limit == "老师助理" || limit == "学生");
  },

  isClassnameValid: function (classname) {
    return this.form.classname.status = (classname != '');
  },

  isAdminnameValid: function (adminname){
    return this.form.adminname.status = (adminname != "");
  },

  isGroupValid: function (group) {
    var result = true;
    if (group == '') result = false;
    var resultArr = group.split(",");
    for (var i = 0; i < resultArr.length; i++) {
      if (!(!isNaN(resultArr[i]) && (parseInt(resultArr[i]) > 0))) {
        result = false; break;
      }
    }
    return this.form.group.status = result;
  },

  isStuGroupValid: function (stuGroup) {
    return this.form.stuGroup.status = !isNaN(stuGroup) && (parseInt(stuGroup) > 0);
  },

  isFieldValid: function(fieldname, value){
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function(){
    return this.form.username.status && this.form.truename.status &&
           this.form.limit.status && this.form.email.status &&
           this.form.password.status && this.form.rePassword.status;
  },

  isSigninValid: function() {
    return this.form.username.status && this.form.password.status;
  },

  isEditValid: function() {
    return this.form.username.status && this.form.truename.status &&
           this.form.limit.status && this.form.email.status;
  },

  isEditPasswordValid: function() {
    return this.form.password.status && this.form.rePassword.status;
  },

  getErrorMessage: function(fieldname){
    return this.form[fieldname].errorMessage;
  },

  isAttrValueUnique: function(registry, user, attr){
    for (var key in registry) {
      if (registry.hasOwnProperty(key) && registry[key][attr] == user[attr]) return false;
    }
    return true;
  },
  // 班级
  isClassValid: function () {
    return this.form.adminname.status && this.form.classname.status;
  },

  isTaValid: function () {
    return this.form.classname.status && this.form.username.status;
  },

  isDeleteTaValid: function () {
    return this.form.classname.status && this.form.username.status;
  },

  isStudentValid: function () {
    return this.form.classname.status && this.form.username.status && this.form.stuGroup.status;
  },

  isDeleteStudentValid: function () {
    return this.form.classname.status && this.form.username.status;
  },

  isHomeworkValid: function () {
    return this.form.classname.status && this.form.homeworkname.status &&
           this.form.link.status && this.form.starttime.status && this.form.endtime.status ;
  },

  isDeleteHomeworkValid: function () {
    return this.form.classname.status && this.form.homeworkname.status;
  },

  isGroupsValid: function () {
    return this.form.classname.status && this.form.homeworkname.status;
  },

  isAddGroupValid: function () {
    return this.form.classname.status && this.form.homeworkname.status
          && this.form.reviewgroup.status && this.form.reviewedgroup.status;
  },

  isDeleteGroupValid: function () {
    return this.form.classname.status && this.form.homeworkname.status
          && this.form.reviewgroup.status && this.form.reviewedgroup.status;
  },

  isSubmitHomeworkValid: function () {
    return this.form.classname.status && this.form.homeworkname.status
          && this.form.githublink.status && this.form.username.status;
  }
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}



