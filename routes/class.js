var validator = require("../public/js/validator");
var path = require('path');
var fs = require('fs');
var xlsx = require('node-xlsx');

module.exports = function (db) {
  var userManager = require("../model/userManager")(db);
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
        userManager.getUserInfo(newClass.adminname).then(function (user) {
          if (user.limit == '老师') {
            classManager.addClass(newClass).then(function () {
              res.end();
            }).catch(function (err) {
              res.status(403).end(err);
            });
          } else {
            res.status(403).end('该用户不是老师权限，请再次确认该用户信息');
          }
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
        // 默认此时登陆系统检测这个是已存在的老师权限
        classManager.getClassInfo(oldClass).then(function (oneClass) {
          //老师助理信息清空
          for (var i = 0; i < oneClass.ta.length; i++) {
            (function (username) {
              userManager.setUserClassname(username, '').then(function () {
                console.log('清空' + username + '的班级信息成功');
              }).catch(function (err) {
                console.log('清空' + username + '的班级信息失败');
              });
            })(oneClass.ta[i].username)
          }
          //学生信息清空
          for (var i = 0; i < oneClass.student.length; i++) {
            (function (username) {
              userManager.setUserGroupAndClassname(username, '', '').then(function () {
                console.log('清空' + username + '的组别和班级信息成功');
              }).catch(function (err) {
                console.log('清空' + username + '的组别和班级信息失败');
              });
            })(oneClass.student[i].username)
          }
          classManager.deleteClass(oldClass).then(function () {
            res.end();
          }).catch(function (err) {
            res.status(403).end(err);
          });
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
        userManager.getUserInfo(newTa.username).then(function (user) {
          if (user.limit == '老师助理') {
            if (user.classname == '') {
              classManager.addTa(newTa).then(function () {
                userManager.setUserClassname(newTa.username, newTa.classname).then(function () {
                  res.end();
                }).catch(function (err) {
                  res.status(403).end(err);
                });
              }).catch(function (err) {
                res.status(403).end(err);
              });
            } else {
              res.status(403).end("该用户已有班别，添加失败");
            }
          } else {
            res.status(403).end("该用户不是老师助理权限，请再次确认该用户");
          }
        }).catch(function (err) {
          res.status(403).end('不存在该用户,请再次确认用户名。');
        });
      }
    },

    deleteTa: function (req, res, next) {
      var oldTa = req.body;
      var validError = classManager.checkDeleteTaValid(oldTa);
      if (validError) {
        res.status(403).end('老师助理表单不合法');
      } else {
        // 默认添加的时候确认是老师助理
        classManager.deleteTa(oldTa).then(function () {
          userManager.setUserClassname(oldTa.username, '').then(function () {
              res.end();
            }).catch(function (err) {
              res.status(403).end(err);
            });
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    getAllStudents: function (req, res, next) {
      var currentClass = req.body;
      classManager.getAllStudents(currentClass).then(function (allStudents) {
        res.json(allStudents);
      }).catch(function (err) {
        console.log(err);
        res.status(403).end("服务器尚未找到班级学生信息");
      });
    },

    addStudent: function (req, res, next) {
      var newStudent = req.body;
      var validError = classManager.checkStudentValid(newStudent);
      if (validError) {
        res.status(403).end('学生表单不合法');
      } else {
        // 检查用户是否存在。。。
        userManager.getUserInfo(newStudent.username).then(function (user) {
          if (user.limit == '学生') {
            if (user.group == '' && user.classname == '') {
              newStudent.homeworkinfo = {};//作业信息存放地方
              classManager.getClassInfo(newStudent).then(function (oneClass) {
                //添加作业信息
                for (var i = 0; i < oneClass.homework.length; i++) {
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname] = {};
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].ta = {};
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].ta.grade = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].ta.comment = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].grade = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].comment = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].classrank = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].grouprank = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].githublink = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].filelink = '';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].imglink = '/images/unsubmit.jpg';
                  newStudent.homeworkinfo[oneClass.homework[i].homeworkname].classmate = {};
                }

                classManager.addStudent(newStudent).then(function () {
                  userManager.setUserGroupAndClassname(newStudent.username, newStudent.stuGroup, newStudent.classname).then(function () {
                    res.end();              
                  }).catch(function (err) {
                    res.status(403).end(err);
                  });
                }).catch(function (err) {
                  res.status(403).end(err);
                });
              }).catch(function (err) {
                res.status(403).end(err);
              });
            } else {
              res.status(403).end('该用户已有班别和组别，添加失败');
            }
          } else {
            res.status(403).end('该用户不是学生权限,请再次确认该用户信息。');
          }
        }).catch(function (err) {
          res.status(403).end('不存在该用户');
        });
      }
    },
//注意未处理///暂时去除这个
    addStudents: function (req, res, next){
      if (!req.files[0] || path.extname(req.files[0].originalname) != '.xlsx') {
        res.send('请上传xlsx类型文件');
        console.log('文件上传错误');
      } else {
        var obj = xlsx.parse('./uploads/' + req.files[0].originalname);
        var studentsArr = arrToStudents(obj);
        /*classManager.addStudents(req.params.classname, studentsArr).then(function () {
          res.redirect('/');
        }).catch(function (err) {
          res.end(err);
        });*/
        res.send('尚未完成该功能');
      }
      if (req.files[0]) {
        fs.unlink('./uploads/' + req.files[0].originalname, function (err){
          console.log('文件删除成功');
        });
      }
    },

    deleteStudent: function (req, res, next) {
      var oldStudent = req.body;
      var validError = classManager.checkDeleteStudentValid(oldStudent);
      if (validError) {
        res.status(403).end('学生表单不合法');
      } else {
        // 默认该用户是学生
        classManager.deleteStudent(oldStudent).then(function () {
          userManager.setUserGroupAndClassname(oldStudent.username, '', '').then(function () {
              res.end();              
            }).catch(function (err) {
              res.status(403).end(err);
            });
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    editStudent: function (req, res, next) {
      var currentStudent = req.body;
      var validError = classManager.checkStudentValid(currentStudent);
      if (validError) {
        res.status(403).end('学生表单不合法');
      } else {
        // 默认该用户是学生
        classManager.editStudent(currentStudent).then(function () {
          userManager.setUserGroupAndClassname(currentStudent.username, currentStudent.stuGroup, currentStudent.classname).then(function () {
              res.end();
            }).catch(function (err) {
              res.status(403).end(err);
            });
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    getAllHomeworks: function (req, res, next) {
      var currentClass = req.body;
      classManager.getAllHomeworks(currentClass).then(function (allHomeworks) {
        res.json(allHomeworks);
      }).catch(function (err) {
        console.log(err);
        res.status(403).end("服务器尚未找到班级作业信息");
      });
    },

    addHomework: function (req, res, next) {
      var newHomework = req.body;
      var validError = classManager.checkHomeworkValid(newHomework);
      if (validError) {
        res.status(403).end('作业表单不合法');
      } else {
        classManager.addHomework(newHomework).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    deleteHomework: function (req, res, next) {
      var oldHomework = req.body;
      var validError = classManager.checkDeleteHomeworkValid(oldHomework);
      if (validError) {
        res.status(403).end('作业表单不合法');
      } else {
        classManager.deleteHomework(oldHomework).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    editHomework: function (req, res, next) {
      var currentHomework = req.body;
      var validError = classManager.checkHomeworkValid(currentHomework);
      if (validError) {
        res.status(403).end('作业表单不合法');
      } else {
        classManager.editHomework(currentHomework).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    getAllGroups: function (req, res, next) {
      var currentHomework = req.body;
      var validError = classManager.checkGroupsValid(currentHomework);
      if (validError) {
        res.status(403).end('组别表单不合法');
      } else {
        classManager.getAllGroups(currentHomework).then(function (allGroups) {
          res.json(allGroups);
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    addGroup: function (req, res, next) {
      var newGroup = req.body;
      var validError = classManager.checkAddGroupValid(newGroup);
      if (validError) {
        res.status(403).end('组别表单不合法');
      } else {
        classManager.addGroup(newGroup).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    deleteGroup: function (req, res, next) {
      var oldGroup = req.body;
      var validError = classManager.checkDeleteGroupValid(oldGroup);
      if (validError) {
        res.status(403).end('作业表单不合法');
      } else {
        classManager.deleteGroup(oldGroup).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    getStuHomeworkInfo: function (req, res, next) {
      var student = req.body;
      classManager.getStuHomeworkInfo(student).then(function (homeworkinfo) {
        res.json(homeworkinfo);
      }).catch(function (err) {
        res.status(403).end(err);
      });
    },

    getAllTeacherComments: function (req, res, next) {
      var teacher = req.body;//只有classname和homeworkname
      classManager.getAllTeacherComments(teacher).then(function (allTeacherComments) {
        res.json(allTeacherComments);
      }).catch(function (err) {
        res.status(403).end(err);
      });
    },

    getAllTaComments: function (req, res, next) {
      var ta = req.body;//只有classname和homeworkname
      classManager.getAllTaComments(ta).then(function (allTaComments) {
        res.json(allTaComments);
      }).catch(function (err) {
        res.status(403).end(err);
      });
    },

    getAllMyComments: function (req, res, next) {
      var student = req.body;//只有classname和username和homeworkname
      classManager.getAllMyComments(student).then(function (allMyComments) {
        res.json(allMyComments);
      }).catch(function (err) {
        res.status(403).end(err);
      });
    },

    getAllOthersComments: function (req, res, next) {//获取用户该评论的信息；
      var student = req.body;//只有classname和username和homeworkname
      userManager.getUserInfo(student.username).then(function (user) {
        if (user.group != "") {
          student.group = user.group;
          classManager.getAllOthersComments(student).then(function (allOthersComments) {
            res.json(allOthersComments);
          }).catch(function (err) {
            res.status(403).end(err);
          });
        } else {
          res.status(403).end('老师尚未给你分配组别');
        }
      }).catch(function (err) {
        res.status(403).end(err);
      });
    },

    submitHomework: function (req, res, next) {
      var newSubmit = req.body;
      var validError = classManager.checkSubmitHomeworkValid(newSubmit);
      if (validError) {
        res.status(403).end("表单有误，请重新输入");
      } else {
        classManager.submitHomework(newSubmit).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    submitComment: function (req, res, next) {
      var newComment = req.body;
      var validError = classManager.checkSubmitCommentValid(newComment);
      if (validError) {
        res.status(403).end("表单有误，请重新输入");
      } else {
        classManager.submitComment(newComment).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    submitTaComment: function (req, res, next) {
      var newComment = req.body;
      var validError = classManager.checkSubmitCommentValid(newComment);
      if (validError) {
        res.status(403).end("表单有误，请重新输入");
      } else {
        classManager.submitTaComment(newComment).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    },

    submitTeacherComment: function (req, res, next) {
      var newComment = req.body;
      var validError = classManager.checkSubmitCommentValid(newComment);
      if (validError) {
        res.status(403).end("表单有误，请重新输入");
      } else {
        classManager.submitTeacherComment(newComment).then(function () {
          res.end();
        }).catch(function (err) {
          res.status(403).end(err);
        });
      }
    }

  };
}

function arrToStudents(obj) {
  var data = [];
  for (var i = 0; i < obj.length; i++) {
    for (var j = 0; j < obj[i].data.length; j++) {
      data.push(obj[i].data[j]);
    }
  }
  var allStudents = [];
  for (var i = 0; i < data.length; i++) {
    (function (studentData){
      var student = {};
      student.username = studentData[0];
      student.stuGroup = studentData[1].toString();
      if (validator.isUsernameValid(student.username) && validator.isStuGroupValid(student.stuGroup)) {
        allStudents.push(student);
      }
    })(data[i]);
  }
  return allStudents;
}