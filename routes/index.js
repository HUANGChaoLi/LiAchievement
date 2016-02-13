var validator = require("../model/validator");
var path = require('path');

module.exports = function (db) {
  var userManager = require("../model/userManager")(db);
  console.log("index connect yes!!");

  return {
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
          res.sendFile('admin.html', { root: path.join(__dirname, '../views') });
          // res.render('admin', {});
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

    editUserPassword: function (req, res, next) {
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

    deleteUser: function (req, res, next) {
      var username = req.body.username;
      userManager.deleteUser(username).then(function (){
        res.end();
      }).catch(function (err){
        res.status(404).end(err);
      });
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
