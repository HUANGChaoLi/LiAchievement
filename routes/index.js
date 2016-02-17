var validator = require("../public/js/validator");
var path = require('path');
var fs = require('fs');
var xlsx = require('node-xlsx');

module.exports = function (db) {
  var userManager = require("../model/userManager")(db);
  console.log("index connect yes!!");

  return {
    getUserInfo: function (req, res) {
      var user = req.body;
      userManager.getUserInfo(user.username).then(function (existedUser){
        res.json(existedUser);
      }).catch(function (err){
        res.status(404).end('不存在该用户');
      });
    },
    /* GET home page. */
    checkLogin: function (req, res, next) {
      if (!req.session.user) {
        res.redirect('/');
      } else {
        next();
      }
    },

    getAllUsers: function (req, res, next) {
      userManager.getAllUsers().then(function (allUser){
        res.json(allUser);
      }).catch(function (err){
        console.log(err)
        res.status(404).send(err);
      });
    },

    index: function(req, res, next) {
        // if (!req.session.user) {
          //res.sendFile('teacher.html', { root: path.join(__dirname, '../views') });
          res.render('index');
        // } else {
        //   res.render('home', {user: req.session.user});
        // }
    },

    /*Unique Check*/
    uniqueCheck: function (req, res, next) {
      var checkFeild = req.body;
      userManager.isAttrValueUnique(checkFeild.attrbute, checkFeild.value).then(function (){
        res.send("");
      }).catch(function(error){
        res.send(error);
      });
    },

    regist: function (req, res, next) {
      var user = req.body;
      var validError = userManager.checkUserValid(user);

      if (validError) {
        res.status(404).json(validError);
      } else {
        delete user.rePassword;//删除rePassword
        userManager.checkUserUnique(user).then(function (){
            delete user.rePassword;//不存储重复密码

            userManager.createUser(user).then(function (){
              res.end();
              // userManager.getUserInfo(user.username)
              //   .then(function (registeredUser){
              //     req.session.user = registeredUser;
              //     req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 30);
              //     res.json(registeredUser);
              //   })
              //   .catch(function (error) {
              //     console.log("用户查询失败 with error" + error);
              //     res.status(404).end("用户查询失败");
              //   });
            }).catch(function(error){
              console.log("用户写入失败");
              res.status(404).end("用户写入失败");
            });
          })
          .catch(function (error) {
            console.log(error);
            res.status(404).end(error);
          });
      }
    },

    editUser: function (req, res, next) {
      var user = req.body;
      var validError = userManager.checkUserValid(user);

      if (validError) {
        res.status(404).json(validError);
      } else {
        userManager.editUser(user).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(404).end(err);
        })
      }
    },

    editUserPassword: function (req, res, next) {//管理员改密码不需要旧密码
      var user = req.body;
      var validError = userManager.checkUserValid(user);

      if (validError) {
        res.status(404).json(validError);
      } else {
        userManager.editUserPassword(user).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(404).end(err);
        })
      }
    },

    changePassword: function (req, res, next) {//普通改密码需要旧密码
      var user = req.body;
      delete user.rePassword;//默认客户端表单重复密码正确；
      var validError = userManager.checkUserValid(user);

      if (validError) {
        res.status(404).end("表单有误，请重新输入");
      } else {
        userManager.changePassword(user).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(404).end(err);
        })
      }
    },

    addUsers: function (req, res, next) {
      if (!req.files[0] || path.extname(req.files[0].originalname) != '.xlsx') {
        res.send('请上传xlsx类型文件');
        console.log('文件上传错误');
      } else {
        var obj = xlsx.parse('./uploads/' + req.files[0].originalname);
        for (var i = 0; i < obj.length; i++) {
          (function (userarr){
            userManager.addUsers(arrToUsers(userarr));
          })(obj[i].data);
        }
        res.redirect('/admin');
      }
      if (req.files[0]) {
        fs.unlink('./uploads/' + req.files[0].originalname, function (err){
          console.log('文件删除成功');
        });
      }
    },

    deleteUser: function (req, res, next) {
      var username = req.body.username;
      userManager.deleteUser(username).then(function (){
        res.end();
      }).catch(function (err){
        res.status(404).end(err);
      });
    },

    deleteUsers: function (req, res, next) {
      if (!req.files[0] || path.extname(req.files[0].originalname) != '.xlsx') {
        res.send('请上传xlsx类型文件');
        console.log('文件上传错误');
      } else {
        var obj = xlsx.parse('./uploads/' + req.files[0].originalname);
        for (var i = 0; i < obj.length; i++) {
          (function (usernamearrs){
            userManager.deleteUsers(usernamearrs);
          })(obj[i].data);
        }
        res.redirect('/admin');
      }
      if (req.files[0]) {
        fs.unlink('./uploads/' + req.files[0].originalname, function (err){
          console.log('文件删除成功');
        });
      }
    },

    signin: function (req, res, next) {
      var user = req.body;

      userManager.checkUserMatch(user)
        .then(function (){
          userManager.getUserInfo(user.username)
            .then(function (registeredUser){
              req.session.user = registeredUser;
              req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 30);
              res.json(registeredUser);
            })
            .catch(function (error){
              console.log("用户查询失败 with error" + error);
              res.status(404).end("用户查询失败");
            });
        })
        .catch(function (error){
          console.log("用户名和密码不符合");
          res.status(404).end("用户名和密码不符合");
        });
    },

    logout: function (req, res, next) {
      var username = req.session.user ? req.session.user.username : "";
      delete req.session.user;
      res.redirect('/');
    }

  };
}

// 将数组类型的对象转换为单一对象

function arrToUsers(usersarr) {
  var users = [];
  for (var i = 0; i < usersarr.length; i++) {
    (function (userarr) {
      var user = arrToUser(userarr);
      for (var key in user) {
        if (user.hasOwnProperty(key)) {
          validator.isFieldValid(key, user[key]);
        }
      }
      if (validator.isFormValid()) {
        delete user.rePassword;
        users.push(user);
      } else {
        console.log(user.username + '表单有误, 注册失败.');
      }
    })(usersarr[i]);
  }
  return users;
}

function arrToUser(userarr) {
  var user = {};
  user.username = userarr[0];
  user.password = userarr[1].toString();
  user.truename = userarr[2];
  user.email = userarr[3];
  user.limit = userarr[4];
  user.rePassword = user.password;
  return user;
}