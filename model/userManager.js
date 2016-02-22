
// var bcrypt = require("bcrypt-nodejs-as-promised");
var crypto = require("crypto");
var validator = require("../public/js/validator");
var _ = require('lodash-node');

module.exports = function (db) {
  var registry = db.collection("user");
  console.log("userManager connect yes!!");

  return {

    createUser: function (user) {
      var sha1 = crypto.createHash("sha1");
      sha1.update(user.password);
      user.password = sha1.digest('hex');
      if (user.limit == '老师助理') {
        user.classname = '';
      }
      if (user.limit == '学生') {
        user.group = '';
        user.classname = '';
      }
      return registry.insert(user);
    },

    addUsers: function (usersarr) {
      registry.find().toArray().then(function (registeredUsers){
        return new Promise(function (resolve, reject){
          var existedUsername = [];
          for (var i = 0; i < registeredUsers.length; i++) {
            existedUsername.push(registeredUsers[i].username);
          }
          for (var i = 0; i < usersarr.length; i++) {
            for (var j = 0; j < existedUsername.length; j++) {
              if (existedUsername[j] == usersarr[i].username) {
                console.log(usersarr[i].username + "用户名已存在，注册失败");
                break;
              }
            }
            if (j == existedUsername.length) {
              existedUsername.push(usersarr[i].username);
              (function (user){
                var sha1 = crypto.createHash("sha1");
                sha1.update(user.password);
                user.password = sha1.digest('hex');
                if (user.limit == '老师助理') {
                  user.classname = '';
                }
                if (user.limit == '学生') {
                  user.group = '';
                  user.classname = '';
                }
                registry.insert(user).then(function () {
                  console.log(user.username + '用户注册成功.');
                });
              })(usersarr[i]);
            }
          }
        });
      });
    },

    deleteUser: function (username) {
      return registry.findOne({username: username}).then(function (user) {
        return new Promise(function (resolve, reject){
          if (user) {
            registry.deleteOne({username: username}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      })
    },

    deleteUsers: function (usernamearrs) {
      for (var i = 0; i < usernamearrs.length; i++) {
        (function (usernamearr) {
          for (var j = 0; j < usernamearr.length; j++) {
            (function (username) {
              registry.deleteOne({username: username}).then(function (user) {
                if (user.result.n > 0) {
                  console.log('Delete ' + username + ' success.');
                } else {
                  console.log('Delete ' + username + ' fail.');
                }
              });
            })(usernamearr[j]);
          }
        })(usernamearrs[i]);
      }
    },

    editUser: function (user) {
      return registry.findOne({username: user.username}).then(function (registeredUser) {
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            registry.updateOne({username: user.username}, 
              {$set: {truename: user.truename, email: user.email, limit: user.limit}}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      })
    },

    editUserPassword: function (user) {
      return registry.findOne({username: user.username}).then(function (registeredUser) {
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            var sha1 = crypto.createHash("sha1");
            sha1.update(user.password);
            user.password = sha1.digest('hex');
            registry.updateOne({username: user.username}, {$set: {password: user.password}}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      })
    },

    changePassword: function (user) {
      return registry.findOne({username: user.username}).then(function (registeredUser) {
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            var sha1 = crypto.createHash("sha1");
            sha1.update(user.oldPassword);
            user.oldPassword = sha1.digest('hex');
            if (user.oldPassword == registeredUser.password) {
              var sha1 = crypto.createHash("sha1");
              sha1.update(user.password);
              user.password = sha1.digest('hex');
              registry.updateOne({username: user.username}, {$set: {password: user.password}}).then(resolve);
            } else {
              reject('旧密码有误,请重新输入');
            }
          } else {
            reject("该用户不存在");
          }
        });
      })
    },

    setUserGroup: function (username, userGroup) {
      return registry.findOne({username: username}).then(function (registeredUser){
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            registry.updateOne({username: username}, {$set: {group: userGroup}}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      });
    },

    setUserClassname: function (username, userClassname) {
      return registry.findOne({username: username}).then(function (registeredUser){
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            registry.updateOne({username: username}, {$set: {classname: userClassname}}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      });
    },

    setUserGroupAndClassname: function (username, userGroup, userClassname) {
      return registry.findOne({username: username}).then(function (registeredUser){
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            registry.updateOne({username: username}, {$set: {group: userGroup, classname: userClassname}}).then(resolve);
          } else {
            reject("该用户不存在");
          }
        });
      });
    },

    getAllUsers: function () {
      return registry.find().toArray().then(function (allUsers){
        return new Promise(function (resolve, reject) {
          if (allUsers) {
            resolve(allUsers);//here
          } else {
            reject("error in getAllBlogs");
          }
        });
      });
    },

    checkUserValid: function (user) {
      var errorMessages;

      for(var key in user) {
        if (!validator.isFieldValid(key, user[key])) {
          if (!errorMessages) errorMessages = {};
          errorMessages[key] = validator.form[key].errorMessage;
        }
      }
      return errorMessages;
    },

  　checkUserUnique: function (user) {
      return registry.findOne({username: user.username})
        .then(function (existedUser){
          return new Promise(function (resolve, reject){
            if (existedUser) {
              var errorMessages = "用户名不唯一，请尝试另一个用户名";
              reject(errorMessages);
            } else {
              resolve();
            }
          });
        });
    },

    checkUserMatch: function (user) {
      var errorMessages = undefined;

      if (user.username == "administrator") {//管理员用户名和密码不能改
        return new Promise(function (resolve, reject) {
          if (user.password == "123456789") {
            user.limit = "admin";
            resolve(user);
          } else {
            reject("密码不正确，请重新尝试");
          }
        });
      } else {
        return registry.findOne({username: user.username}).then(function (registeredUser) {
          // 获取到用户接着检验是否密码正确;
          return new Promise(function (resolve, reject) {
              if (registeredUser) {
                var sha1 = crypto.createHash("sha1");
                sha1.update(user.password);
                if (registeredUser.password == sha1.digest('hex')) {
                    resolve(registeredUser);
                  } else {
                    if (!errorMessages) errorMessages = {};
                    errorMessages.password = "密码不正确，请重新尝试";
                    reject(errorMessages);
                  }
              } else {
                if (!errorMessages) errorMessages = {};
                  errorMessages.username = "用户名不存在";
                  reject(errorMessages);
                }
              });
          });
      }

    },

    getUserInfo: function (username) {
      return registry.findOne({username: username}).then(function (registeredUser){
        return new Promise(function (resolve, reject){
          if (registeredUser) {
            var user = {};
            for (var attr in registeredUser) {
              if (registeredUser.hasOwnProperty(attr) && attr != "password") {
                user[attr] = registeredUser[attr];
              }
            }
            resolve(user);
          } else {
            reject("User is not found!!!");
          }
        });
      });
    },

    isAttrValueUnique: function (attr, value) {
      var check = {};
      check[attr] = value;
      return registry.findOne(check)
        .then(function (existedUser){
          return new Promise(function (resolve, reject){
            if (existedUser) {
              reject("key: " + attr + " is not unique by value: " + value);
            } else {
              resolve();
            }
          });
        });
    }

  };
}


function getQueryForUniqueInAttr(user) {
  return {
    $or: _(user).omit('password').pairs().map(pairToObject).value()
  };
}

function pairToObject(pair) {
  var obj = {};
  obj[pair[0]] = pair[1];
  return obj;
}
