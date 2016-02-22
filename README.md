#MyAchievement

#0.启动方式：在当前文件夹在输入以下命令：npm install安装必要依赖文件，在当前文件夹新建data目录存放数据库资料，mongod --dbpath ./data命令启动mongodb，最后另起一个命令行输入npm start便可以开启应用；

#1.管理员用户名administrator;密码123456789;
  管理员可以修改任何人的密码以防止出现忘记密码的情况（不需提供旧密码）;

#2.权限: 老师，老师助理，学生

#3.使用excel文件的注册结构
  |用户名<学号>|密码|姓名<真实姓名>|邮箱|权限|
  (注：权限一定要是：老师，老师助理，学生  这三种。)

#4.删除结构
  |用户名|...
  .
  .
  .

#5.数据库信息存储参考
 <1>user:{username, password, truename, email, classname(学生和ta有), group(学生有)}
    (注：每个TA只能有一个班别，每个学生只能有一个班别和一个老师分配的组别)
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

#6.老师可以进行以下的操作
  (1).新建新班级（可删除）
  (2).添加班级的老师助理（可编辑可删除）
  (3).添加班级的学生并分配所在组别（可编辑可删除）
  (4).发布作业（可编辑可删除）
  (5).查看班级同学提交情况并最后确定分数和评论（评分的时候可以参照老师助理的意见，服务端会给出TA评论的信息）
  (6).等评论完了时候可以发布成绩和排名，系统会自动确定班级排名; //尚未完成小组排名

#7.老师助理可以进行以下的操作
  (1).给某一作业给同学分配互评组（注：只有老师助理权限的用户可以，老师权限只可以确定学生的组别）;并且只能在作业期间和作业未发布的时候分配,作业结束之后不可分配（可删除可更改）
  (2).查看学生的作业并且评论（可更改）

#8.学生可以进行以下的操作
    （注：为避免知道评论自己的组别该系统不给提供自己评论的组别和别人评论自己的组别）
  (1).查看作业
  (2).提交作业和修改作业提交（目前只支持github地址的提交）
  (3).根据老师助理分配的该作业互评组查看同学的作业并且评论
  (4).查看自己的排名和分数，包括查看自己所有以往作业情况(注：只完成了班级排名，小组排名未完成)