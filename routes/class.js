var validator = require("../public/js/validator");
var path = require('path');
var fs = require('fs');
var xlsx = require('node-xlsx');

module.exports = function (db) {
  // var userManager = require("../model/userManager")(db);
  var classManager = require("../model/classManager")(db);
  console.log("class connect yes!!");

  return {

    getAllClasses: function (req, res, next) {
      classManager.getAllClasses().then(function (allClasses) {
        res.json(allClasses);
      }).catch(function (err) {
        console.log(err);
        res.status(403).end("服务器尚未找到班级信息");
      });
    },

    addClass: function (req, res, next) {
      var newClass = req.body;
      var validError = classManager.checkClassValid(newClass);
      if (validError) {
        res.end('班级表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.addClass(newClass).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    deleteClass: function (req, res, next) {
      var oldClass = req.body;
      var validError = classManager.checkClassValid(oldClass);
      if (validError) {
        res.end('班级表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.deleteClass(oldClass).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    }
  };
}