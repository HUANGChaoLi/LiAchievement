
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })


module.exports = function (db) {
  var api = require('./routes/api')(db);
  var routes = require('./routes/index')(db);
  var Class = require('./routes/class')(db);
  console.log("app success!!!");

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
      cookie: {maxAge: 60000 * 20}, // 20 minutes
      store: new FileStore(),
      secret: 'my achievement system',
      resave: false,
      saveUninitialized: false
  }));

  app.use(express.static(path.join(__dirname, 'public')));


  // Routes

  app.get('/favicon.ico', function (req, res){
    res.end();
  });

  // User

  app.get('/', routes.index);

  app.get('/getAllUsers', routes.getAllUsers);

  app.post('/getUserInfo', routes.getUserInfo);

  app.post('/uniqueCheck', routes.uniqueCheck);

  app.post('/uploadAddUsers', upload.any(), routes.addUsers);

  app.post('/uploadDeleteUsers', upload.any(), routes.deleteUsers);

  app.post('/regist', routes.regist);

  app.post('/deleteUser', routes.deleteUser);

  app.post('/editUser', routes.editUser);

  app.post('/editUserPassword', routes.editUserPassword);

  app.post('/signin', routes.signin);

  app.all('/logout', routes.logout);

  // Class

  app.post('/getAllClasses', Class.getAllClasses);

  app.post('/addClass', Class.addClass);

  app.post('/deleteClass', Class.deleteClass);

  // Ta

  app.post('/getAllTAs', Class.getAllTAs);

  app.post('/addTa', Class.addTa);

  app.post('/deleteTa', Class.deleteTa);

  app.post('/editTa', Class.editTa);

  // Student


  app.post('/getAllStudents', Class.getAllStudents);

  app.post('/addStudent', Class.addStudent);

  app.post('/uploadAddStudents/:classname', upload.any(), Class.addStudents);

  app.post('/deleteStudent', Class.deleteStudent);

  app.post('/editStudent', Class.editStudent);


  // Homework

  app.post('/getAllHomeworks', Class.getAllHomeworks);

  app.post('/addHomework', Class.addHomework);

  app.post('/deleteHomework', Class.deleteHomework);

  app.post('/editHomework', Class.editHomework);

  // Blog

  /*检查是否登录*/
  // app.get('*', routes.checkLogin);

  app.get("/data/Blogs", api.getAllBlogs);

  app.get("/data/AdminName", api.getAdminName);

  app.post("/data/addComment", api.addComment);

  app.post('/data/editBlog', api.editBlog);

  app.post('/data/deleteBlog', api.deleteBlog);

  app.post('/data/addBlog', api.addBlog);

  app.post('/data/editComment', api.editComment);

  app.post('/data/deleteComment', api.deleteComment);

  app.post('/data/lockBlog', api.lockBlog);

  app.post('/data/unlockBlog', api.unlockBlog);

  app.post('/data/lockComment', api.lockComment);

  app.post('/data/unlockComment', api.unlockComment);


  app.get('/teacher/:name', function (req, res, next){
    var name = req.params.name;
    res.render('teacher/' + name);
  });

// redirect all others to the index (HTML5 history)
  app.get('/*', routes.index);

  return app;
}

