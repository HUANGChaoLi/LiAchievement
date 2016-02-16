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
      var currentClass = req.body;
      classManager.getAllClasses(currentClass).then(function (allClasses) {
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
        res.status(403).end('班级表单不合法');
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
        res.status(403).end('班级表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.deleteClass(oldClass).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    getAllTAs: function (req, res, next) {
      var currentClass = req.body;
      classManager.getAllTAs(currentClass).then(function (allTAs) {
        res.json(allTAs);
      }).catch(function (err) {
        console.log(err);
        res.status(403).end("服务器尚未找到老师助理信息");
      });
    },

    addTa: function (req, res, next) {
      var newTa = req.body;
      var validError = classManager.checkTaValid(newTa);
      if (validError) {
        res.status(403).end('老师助理表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.addTa(newTa).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    deleteTa: function (req, res, next) {
      var oldTa = req.body;
      var validError = classManager.checkTaValid(oldTa);
      if (validError) {
        res.status(403).end('老师助理表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.deleteTa(oldTa).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    editTa: function (req, res, next) {
      var currentTa = req.body;
      var validError = classManager.checkTaValid(currentTa);
      if (validError) {
        res.status(403).end('老师助理表单不合法');
      } else {
        // 检查用户是否存在。。。
        classManager.editTa(currentTa).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    }

  };
}