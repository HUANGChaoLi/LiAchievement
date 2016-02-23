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
              newHomework.distributeList = [];
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

    //组别管理

    getAllGroups: function (currentHomework) {
      return classes.findOne({classname: currentHomework.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var homeworks = existedClass.homework;
            for (var i = 0; i < homeworks.length; i++) {
              if (homeworks[i].homeworkname == currentHomework.homeworkname) {
                break;
              }
            }
            if (i == homeworks.length) {
              reject('不存在该作业的组别信息');
            } else {
              resolve(homeworks[i].distributeList);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    addGroup: function (newGroup) {
      return classes.findOne({classname: newGroup.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var homeworks = existedClass.homework;
            for (var i = 0; i < homeworks.length; i++) {
              if (homeworks[i].homeworkname == newGroup.homeworkname) {
                break;
              }
            }
            if (i != homeworks.length) {
              var NRG = newGroup.reviewgroup, NRDG = newGroup.reviewedgroup;
              for (var j = 0; j < homeworks[i].distributeList.length; j++) {
                if (NRG == homeworks[i].distributeList[j].reviewgroup || 
                    NRG == homeworks[i].distributeList[j].reviewedgroup ||
                    NRDG == homeworks[i].distributeList[j].reviewgroup || 
                    NRDG == homeworks[i].distributeList[j].reviewedgroup) {
                  break;
                }
              }
              if (j == homeworks[i].distributeList.length) {
                var newOne = {};
                newOne.reviewgroup = newGroup.reviewgroup;
                newOne.reviewedgroup = newGroup.reviewedgroup;
                homeworks[i].distributeList.push(newOne);
                classes.updateOne({classname: newGroup.classname}, {$set: {homework: homeworks}}).then(resolve);
              } else {
                reject('该组别其中一个已经在其他互评组,请重试');
              }
            } else {
              reject("不存在该班级")
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    deleteGroup: function (oldGroup) {
      return classes.findOne({classname: oldGroup.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var homeworks = existedClass.homework;
            for (var i = 0; i < homeworks.length; i++) {
              if (homeworks[i].homeworkname == oldGroup.homeworkname) {
                break;
              }
            }
            if (i != homeworks.length) {
              var NRG = oldGroup.reviewgroup, NRDG = oldGroup.reviewedgroup;
              for (var j = 0; j < homeworks[i].distributeList.length; j++) {
                if (NRG == homeworks[i].distributeList[j].reviewgroup &&
                    NRDG == homeworks[i].distributeList[j].reviewedgroup) {
                  break;
                }
              }
              if (j != homeworks[i].distributeList.length) {
                homeworks[i].distributeList.splice(j, 1);
                classes.updateOne({classname: oldGroup.classname}, {$set: {homework: homeworks}}).then(resolve);
              } else {
                reject('不存在该组');
              }
            } else {
              reject("不存在该班级")
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    checkGroupsValid: function (groups) {
      for (var key in groups) {
        if (groups.hasOwnProperty(key)) {
          validator.isFieldValid(key, groups[key]);
        }
      }
      if (validator.isGroupsValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    checkAddGroupValid: function (group) {
      for (var key in group) {
        if (group.hasOwnProperty(key)) {
          validator.isFieldValid(key, group[key]);
        }
      }
      if (validator.isAddGroupValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    checkDeleteGroupValid: function (group) {
      for (var key in group) {
        if (group.hasOwnProperty(key)) {
          validator.isFieldValid(key, group[key]);
        }
      }
      if (validator.isDeleteGroupValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    //老师端

    getAllTeacherComments: function (teacher) {
      return classes.findOne({classname: teacher.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            var results = [];
            for (var i = 0; i < students.length; i++) {
              var one = {};
              one.githublink = students[i].homeworkinfo[teacher.homeworkname].githublink;
              one.imglink = students[i].homeworkinfo[teacher.homeworkname].imglink;
              one.username = students[i].username;
              if (students[i].homeworkinfo[teacher.homeworkname].grade != "") {
                one.grade = students[i].homeworkinfo[teacher.homeworkname].grade;
                one.comment = students[i].homeworkinfo[teacher.homeworkname].comment;
              } else if (students[i].homeworkinfo[teacher.homeworkname].ta.grade != "") {
                one.grade = "TA:" + students[i].homeworkinfo[teacher.homeworkname].ta.grade + "分";
                one.comment = "您尚未评论,以下是TA评论:" + students[i].homeworkinfo[teacher.homeworkname].ta.comment;
              } else {
                one.grade = "";
                one.comment = "您和老师助理均尚未评分";
              }
              results.push(one);
            }
            resolve(results);
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    submitTeacherComment: function (newSubmit) {
      return classes.findOne({classname: newSubmit.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == newSubmit.commentuser) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该评论用户');
            } else {
              if (!students[i].homeworkinfo[newSubmit.homeworkname]) {
                reject('不存在该作业');
              } else {
                students[i].homeworkinfo[newSubmit.homeworkname].grade = newSubmit.grade;
                students[i].homeworkinfo[newSubmit.homeworkname].comment = newSubmit.comment;
                classes.updateOne({classname: newSubmit.classname}, {$set: {student: students}}).then(resolve);
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    //Ta端

    getAllTaComments: function (ta) {
      return classes.findOne({classname: ta.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            var results = [];
            for (var i = 0; i < students.length; i++) {
              var one = {};
              one.githublink = students[i].homeworkinfo[ta.homeworkname].githublink;
              one.imglink = students[i].homeworkinfo[ta.homeworkname].imglink;
              one.grade = students[i].homeworkinfo[ta.homeworkname].ta.grade;
              one.comment = students[i].homeworkinfo[ta.homeworkname].ta.comment;
              one.username = students[i].username;
              results.push(one);
            }
            resolve(results);
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    submitTaComment: function (newSubmit) {
      return classes.findOne({classname: newSubmit.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == newSubmit.commentuser) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该评论用户');
            } else {
              if (!students[i].homeworkinfo[newSubmit.homeworkname]) {
                reject('不存在该作业');
              } else {
                students[i].homeworkinfo[newSubmit.homeworkname].ta.grade = newSubmit.grade;
                students[i].homeworkinfo[newSubmit.homeworkname].ta.comment = newSubmit.comment;
                classes.updateOne({classname: newSubmit.classname}, {$set: {student: students}}).then(resolve);
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
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
    },

    getAllMyComments: function (student) {
      return classes.findOne({classname: student.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == student.username) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该用户的作业信息');
            } else {
              if (!students[i].homeworkinfo[student.homeworkname]) {
                reject('不存在该作业的评论信息');
              } else {
                var results = [];
                if (students[i].homeworkinfo[student.homeworkname].grade != '') {
                  var one = {};
                  one.grade = students[i].homeworkinfo[student.homeworkname].grade; 
                  one.comment = students[i].homeworkinfo[student.homeworkname].comment;
                  one.look = "teacher";
                  results.push(one);
                }
                if (students[i].homeworkinfo[student.homeworkname].ta.grade != '') {
                  var one = {};
                  one.grade = students[i].homeworkinfo[student.homeworkname].ta.grade;
                  one.comment = students[i].homeworkinfo[student.homeworkname].ta.comment;
                  one.look = "ta";
                  results.push(one);
                }
                var classmates = students[i].homeworkinfo[student.homeworkname].classmate;
                for (var key in classmates) {
                  if (classmates.hasOwnProperty(key)) {
                    var one = {};
                    one.grade = classmates[key].grade;
                    one.comment = classmates[key].comment;
                    one.look = "student";
                    results.push(one);
                  }
                }
                resolve(results);
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    getAllOthersComments: function (student) {
      return classes.findOne({classname: student.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var homeworks = existedClass.homework;
            for (var i = 0; i < homeworks.length; i++) {
              if (homeworks[i].homeworkname == student.homeworkname) {
                break;
              }
            }
            if (i == homeworks.length) {
              reject('不存在该作业信息');
            } else {
              var distributeList = homeworks[i].distributeList;
              var Group = null;//确定要评论的组别
              for (var j = 0; j < distributeList.length; j++) {
                if (distributeList[j].reviewgroup == student.group) {
                  Group = distributeList[j].reviewedgroup;
                  break;
                } else if (distributeList[j].reviewedgroup == student.group) {
                  Group = distributeList[j].reviewgroup;
                  break;
                }
              }
              if (Group) {
                var students = existedClass.student;
                var results = [];
                var one = {};
                console.log("bbb")
                for (var i = 0; i < students.length; i++) {
                  if (students[i].stuGroup == Group && students[i].homeworkinfo[student.homeworkname]) {
                    one.imglink = students[i].homeworkinfo[student.homeworkname].imglink;
                    one.githublink = students[i].homeworkinfo[student.homeworkname].githublink;
                    one.username = students[i].username;
                    if (students[i].homeworkinfo[student.homeworkname].classmate[student.username]) {
                      one.grade = students[i].homeworkinfo[student.homeworkname].classmate[student.username].grade;
                      one.comment = students[i].homeworkinfo[student.homeworkname].classmate[student.username].comment;
                    } else {
                      one.grade = '';
                      one.comment = '';
                    }
                    results.push(one);
                  }
                }
                console.log("cccc")
                resolve(results);
              } else {
                reject('老师助理尚未分配你的互评组');
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    submitHomework: function (newSubmit) {
      return classes.findOne({classname: newSubmit.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == newSubmit.username) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该用户');
            } else {
              if (!students[i].homeworkinfo[newSubmit.homeworkname]) {
                reject('不存在该作业');
              } else {
                students[i].homeworkinfo[newSubmit.homeworkname].githublink = newSubmit.githublink;
                students[i].homeworkinfo[newSubmit.homeworkname].imglink = '/images/homework.png';
                classes.updateOne({classname: newSubmit.classname}, {$set: {student: students}}).then(resolve);
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    checkSubmitHomeworkValid: function (submit) {
      for (var key in submit) {
        if (submit.hasOwnProperty(key)) {
          validator.isFieldValid(key, submit[key]);
        }
      }
      if (validator.isSubmitHomeworkValid()) {
        return null;
      } else {
        return "表单信息不正确";
      }
    },

    checkSubmitCommentValid: function (submit) {
      return !(!isNaN(submit.grade) && (parseInt(submit.grade) > 0) && (parseInt(submit.grade) <= 100) && (submit.comment != ""));
    },

    submitComment: function (newSubmit) {
      return classes.findOne({classname: newSubmit.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == newSubmit.commentuser) {
                break;
              }
            }
            if (i == students.length) {
              reject('不存在该评论用户');
            } else {
              if (!students[i].homeworkinfo[newSubmit.homeworkname]) {
                reject('不存在该作业');
              } else {
                students[i].homeworkinfo[newSubmit.homeworkname].classmate[newSubmit.username] = {};
                students[i].homeworkinfo[newSubmit.homeworkname].classmate[newSubmit.username].grade = newSubmit.grade;
                students[i].homeworkinfo[newSubmit.homeworkname].classmate[newSubmit.username].comment = newSubmit.comment;
                classes.updateOne({classname: newSubmit.classname}, {$set: {student: students}}).then(resolve);
              }
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    submitRank: function (newSubmit) {
      return classes.findOne({classname: newSubmit.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var students = existedClass.student;
            students.sort(sortByGrade.bind(null, newSubmit.homeworkname));
            var j = 1;
            for (var i = 0; i < students.length; i++) {
              if (students[i].homeworkinfo[newSubmit.homeworkname]) {
                students[i].homeworkinfo[newSubmit.homeworkname].classrank = j + "";
                j++;
              } else {
                console.log("确定" + students[i].username + "在作业" + newSubmit.homeworkname + "中班级排名失败")
              }
            }
            classes.updateOne({classname: newSubmit.classname}, {$set: {student: students}}).then(resolve);
          } else {
            reject('不存在该班级');
          }
        });
      });
    },

    getAllMyScopeAndRank: function (user) {
      return classes.findOne({classname: user.classname}).then(function (existedClass) {
        return new Promise(function (resolve, reject){
          if (existedClass) {
            var result = {};
            result.grade = [];
            result.rank = [];
            var students = existedClass.student;
            for (var i = 0; i < students.length; i++) {
              if (students[i].username == user.username) {
                break;
              }
            }
            if (i == students.length) {
              reject("不存在该学生");
            } else {
              var info = students[i].homeworkinfo;
              var homeworks = existedClass.homework;
              for (var j = 0; j < homeworks.length; j++) {
                if (info[homeworks[j].homeworkname].grade && info[homeworks[j].homeworkname].grade != "") {
                  result.grade.push(parseInt(info[homeworks[j].homeworkname].grade));
                }
                if (info[homeworks[j].homeworkname].classrank && info[homeworks[j].homeworkname].classrank != "") {
                  result.rank.push(parseInt(info[homeworks[j].homeworkname].classrank));
                }
              }
              resolve(result);
            }
          } else {
            reject('不存在该班级');
          }
        });
      });
    }

  };
}


function sortByGrade(homeworkname, a, b) {
  var agrade = a.homeworkinfo[homeworkname].grade;
  var bgrade = b.homeworkinfo[homeworkname].grade;
  if (agrade == "") agrade = "0";
  if (bgrade == "") bgrade = "0";
  return  bgrade - agrade;
}