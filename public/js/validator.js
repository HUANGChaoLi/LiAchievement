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
    }
  }, 

  isUsernameValid: function (username){
    return this.form.username.status = (username != "");
  },

  isPasswordValid: function (password){
    this.passwords = password;
    return this.form.password.status = /^[a-zA-Z0-9\-\_]{6,12}$/.test(password);
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
    return this.form.limit.status = (limit != "");
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
  }
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}



