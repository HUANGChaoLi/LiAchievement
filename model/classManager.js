var validator = require("../public/js/validator");

module.exports = function (db) {
  var classes = db.collection("class");
  console.log("classManager connect yes!!");

  return {
    getAllClasses: function () {
      return classes.find().toArray().then(function (allClasses){
        return new Promise(function (resolve, reject) {
          if (allClasses) {
            resolve(allClasses);//here
          } else {
            reject("error in getAllClasses");
          }
        });
      });
    },

    addClass: function (newClass) {
      return classes.insert(newClass);
    },

    deleteClass: function (oldClass) {
      return classes.deleteOne({adminname: oldClass.adminname, classname: oldClass.classname}).then(function (result){
        return new Promise(function (resolve, reject){
          if (result.result.n > 0) {
            resolve();
          } else {
            reject(oldClass.adminname + '用户下无该班级');
          }
        });
      });
    },

    checkClassValid: function (Class) {
      for (var key in Class) {
        if (Class.hasOwnProperty(key)) {
          validator.isFieldValid(key, Class[key]);
        }
      }
      if (validator.isClassValid) {
        return null;
      } else {
        return "表单信息不正确";
      }
    }
  };
}
