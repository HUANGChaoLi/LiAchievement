var validator = require("../public/js/validator");

module.exports = function (db) {
  var classes = db.collection("class");
  console.log("classManager connect yes!!");

  return {
    getAllClasses: function (currentClass) {
      return classes.find({adminname: currentClass.adminname}, {"adminname": 1, "classname": 1}).toArray().then(function (allClasses){
        return new Promise(function (resolve, reject) {
          if (allClasses) {
            resolve(allClasses);
          } else {
            reject("error in getAllClasses");
          }
        });
      });
    },

    addClass: function (newClass) {
      newClass.ta = [];
      newClass.student = [];
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
      if (validator.isClassValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    getAllTAs: function (currentClass) {
      return classes.findOne({classname: currentClass.classname}, {"ta": 1}).then(function (allTAs){
        return new Promise(function (resolve, reject) {
          if (allTAs) {
            resolve(allTAs.ta);
          } else {
            reject("error in getAllTAs");
          }
        });
      });
    },

    addTa: function (newTa) {
      return classes.findOne({classname: newTa.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var TAs = existedClass.ta;
            for (var i = 0; i < TAs.length; i++) {
              if (TAs[i].username == newTa.username) {
                reject('已经存在该老师助理,如果需要修改组别请在列表操作');
                break;
              }
            }
            if (i == TAs.length) {
              var newOne = {};
              newOne.username = newTa.username;
              newOne.group = newTa.group;
              classes.updateOne({classname: newTa.classname}, {$push: {ta: newOne}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    deleteTa: function (oldTa) {
      return classes.findOne({classname: oldTa.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var TAs = existedClass.ta;
            for (var i = 0; i < TAs.length; i++) {
              if (TAs[i].username == oldTa.username) break;
            }
            if (TAs.length == i) {
                reject('不存在该助理');
            } else {
              TAs.splice(i, 1);
              classes.updateOne({classname: oldTa.classname}, {$set: {ta : TAs}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    editTa: function (currentTa) {
      return classes.findOne({classname: currentTa.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var TAs = existedClass.ta;
            for (var i = 0; i < TAs.length; i++) {
              if (TAs[i].username == currentTa.username) break;
            }
            if (TAs.length == i) {
                reject('不存在该助理');
            } else {
              TAs[i].group = currentTa.group;
              classes.updateOne({classname: currentTa.classname}, {$set: {ta : TAs}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    checkTaValid: function (Ta) {
      for (var key in Ta) {
        if (Ta.hasOwnProperty(key)) {
          validator.isFieldValid(key, Ta[key]);
        }
      }
      if (validator.isTaValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    }

  };
}
