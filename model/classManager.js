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
      newClass.homework = [];
      return classes.insert(newClass);
    },

    getClassInfo: function (currentClass) {
      return classes.findOne({classname: currentClass.classname}).then(function (thisClass) {
        return new Promise(function (resolve, reject) {
          if (thisClass) {
            resolve(thisClass);
          } else {
            reject('不存在该班级');
          }
        });
      })
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
    },

    checkDeleteTaValid: function (Ta) {
      for (var key in Ta) {
        if (Ta.hasOwnProperty(key)) {
          validator.isFieldValid(key, Ta[key]);
        }
      }
      if (validator.isDeleteTaValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    getAllStudents: function (currentClass) {
      return classes.findOne({classname: currentClass.classname}, {"student": 1}).then(function (allStudents){
        return new Promise(function (resolve, reject) {
          if (allStudents) {
            resolve(allStudents.student);
          } else {
            reject("error in getAllStudents");
          }
        });
      });
    },

    addStudent: function (newStudent) {
      return classes.findOne({classname: newStudent.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Students = existedClass.student;
            for (var i = 0; i < Students.length; i++) {
              if (Students[i].username == newStudent.username) {
                reject('已经存在该学生,如果需要修改组别请在列表操作');
                break;
              }
            }
            if (i == Students.length) {
              var newOne = {};
              newOne.username = newStudent.username;
              newOne.stuGroup = newStudent.stuGroup;
              newOne.homeworkinfo = newStudent.homeworkinfo;
              classes.updateOne({classname: newStudent.classname}, {$push: {student: newOne}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    addStudents: function (classname, newStudents) {
      return classes.findOne({classname: classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Students = existedClass.student;
            for (var i = 0; i < newStudents.length; i++) {
              for (var j = 0; j < Students.length; j++) {
                if (newStudents[i].username == Students[j].username) {
                  console.log('已经存在' + newStudents[i].username + ',添加失败');
                  break;
                }
              }
              if (j == Students.length) {
                Students.push(newStudents[i]);
                console.log(newStudents[i].username + '添加成功');
              }
            }
            classes.updateOne({classname: classname}, {$set: {student: Students}}).then(resolve);
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    deleteStudent: function (oldStudent) {
      return classes.findOne({classname: oldStudent.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Students = existedClass.student;
            for (var i = 0; i < Students.length; i++) {
              if (Students[i].username == oldStudent.username) break;
            }
            if (Students.length == i) {
                reject('不存在该学生');
            } else {
              Students.splice(i, 1);
              classes.updateOne({classname: oldStudent.classname}, {$set: {student : Students}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    editStudent: function (currentStudent) {
      return classes.findOne({classname: currentStudent.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Students = existedClass.student;
            for (var i = 0; i < Students.length; i++) {
              if (Students[i].username == currentStudent.username) break;
            }
            if (Students.length == i) {
                reject('不存在该学生');
            } else {
              Students[i].stuGroup = currentStudent.stuGroup;
              classes.updateOne({classname: currentStudent.classname}, {$set: {student : Students}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    checkStudentValid: function (student) {
      for (var key in student) {
        if (student.hasOwnProperty(key)) {
          validator.isFieldValid(key, student[key]);
        }
      }
      if (validator.isStudentValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    checkDeleteStudentValid: function (student) {
      for (var key in student) {
        if (student.hasOwnProperty(key)) {
          validator.isFieldValid(key, student[key]);
        }
      }
      if (validator.isDeleteStudentValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    getAllHomeworks: function (currentClass) {
      return classes.findOne({classname: currentClass.classname}, {"homework": 1}).then(function (allHomeworks){
        return new Promise(function (resolve, reject) {
          if (allHomeworks) {
            resolve(allHomeworks.homework);
          } else {
            reject("error in getAllHomeworks");
          }
        });
      });
    },

    addHomework: function (newHomework) {
      return classes.findOne({classname: newHomework.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Homeworks = existedClass.homework;
            for (var i = 0; i < Homeworks.length; i++) {
              if (Homeworks[i].homeworkname == newHomework.homeworkname) {
                reject('已经存在该作业,如果需要修改作业请在列表操作');
                break;
              }
            }
            if (i == Homeworks.length) {
              var thisClassname = newHomework.classname;
              delete newHomework.classname;
              Homeworks.push(newHomework);
              //给每个学生添加新的作业的的信息
              var newOne = existedClass.student;
              for (var i = 0; i < newOne.length; i++) {
                if (!newOne[i].homeworkinfo[newHomework.homeworkname]) {
                  newOne[i].homeworkinfo[newHomework.homeworkname] = {};
                  newOne[i].homeworkinfo[newHomework.homeworkname].ta = {};
                  newOne[i].homeworkinfo[newHomework.homeworkname].ta.grade = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].ta.comment = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].grade = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].comment = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].classrank = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].grouprank = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].githublink = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].filelink = '';
                  newOne[i].homeworkinfo[newHomework.homeworkname].imglink = '/images/unsubmit.jpg';
                  newOne[i].homeworkinfo[newHomework.homeworkname].classmate = {};
                  console.log('给' + newOne[i].username + '添加' + newHomework.homeworkname +'成功')
                } else {
                  console.log("添加作业函数有误");
                }
              }
              classes.updateOne({classname: thisClassname}, {$set: {homework : Homeworks, student: newOne}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    deleteHomework: function (oldHomework) {
      return classes.findOne({classname: oldHomework.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Homeworks = existedClass.homework;
            for (var i = 0; i < Homeworks.length; i++) {
              if (Homeworks[i].homeworkname == oldHomework.homeworkname) break;
            }
            if (Homeworks.length == i) {
                reject('不存在该作业');
            } else {
              //删除所有的学生的该作业信息
              var newOne = existedClass.student;
              for (var j = 0; j < newOne.length; j++) {
                delete newOne[j].homeworkinfo[oldHomework.homeworkname]
              }
              Homeworks.splice(i, 1);
              classes.updateOne({classname: oldHomework.classname}, {$set: {homework : Homeworks, student: newOne}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    editHomework: function (currentHomework) {
      return classes.findOne({classname: currentHomework.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var Homeworks = existedClass.homework;
            for (var i = 0; i < Homeworks.length; i++) {
              if (Homeworks[i].homeworkname == currentHomework.homeworkname) break;
            }
            if (Homeworks.length == i) {
                reject('不存在该作业');
            } else {
              for (var key in Homeworks[i]) {
                if (Homeworks[i].hasOwnProperty(key)) {
                  Homeworks[i][key] = currentHomework[key];
                }
              }
              classes.updateOne({classname: currentHomework.classname}, {$set: {homework : Homeworks}}).then(resolve);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    checkHomeworkValid: function (homework) {
      for (var key in homework) {
        if (homework.hasOwnProperty(key)) {
          validator.isFieldValid(key, homework[key]);
        }
      }
      if (validator.isHomeworkValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    checkDeleteHomeworkValid: function (homework) {
      for (var key in homework) {
        if (homework.hasOwnProperty(key)) {
          validator.isFieldValid(key, homework[key]);
        }
      }
      if (validator.isDeleteHomeworkValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    //学生端函数 
    getStuHomeworkInfo: function (homework) {
      return classes.findOne({classname: homework.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == homework.username) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该用户的作业信息');
            } else {
              resolve(students[i].homeworkinfo);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    }

  };
}
