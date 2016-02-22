#MyAchievement
1.实现管理员功能
2.权限: 老师，老师助理，学生
3.注册结构
  |用户名<学号>|密码|姓名<真实姓名>|邮箱|权限|
  注：权限一定要是：老师，老师助理，学生  这三种。
4.删除结构
  |用户名|...
  .
  .
  .
5.数据库信息存储
 <1>user:{username, password, truename, email, classname(学生和ta有), group(学生有)}
 <2>class:{
    adminname, 
    classname, 
    homework[{homewrokname, link, starttime, endtime, distributeList:[{reviewgroup, reviewedgroup}]}], 
    ta[{username}], 
    student[{username, 
              stuGroup, 
              homeworkinfo{KEY-homeworkname{
                  ta{grade, comment}, 
                  grade, //老师改的
                  comment, //老师改的
                  classrank, 
                  grouprank,
                  githublink, 
                  filelink, 
                  imglink,
                  classmate{KEY-username{grade,comment}}
              }}
            }]
    }