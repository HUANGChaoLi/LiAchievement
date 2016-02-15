var validator = require("../public/js/validator");
var path = require('path');
var fs = require('fs');
var xlsx = require('node-xlsx');

module.exports = function (db) {
  var userManager = require("../model/userManager")(db);
  var classManager = require("../model/classManager")(db);
  console.log("class connect yes!!");

  return {
    
    addClass: function (req, res, next) {
      var newClass = req.body;
      validator;
      classManager.addClass(newClass).then(function () {
        res.end();
      }).catch(function (err) {
        res.end(err);
      });
    },

    deleteClass: function (req, res, next) {
      var classname = req.body.classname;
      validator;
      classManager.deleteClass(classname).then(function () {
        res.end();
      }).catch(function (err) {
        res.end(err);
      });
    }
  };
}