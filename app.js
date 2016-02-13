
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


module.exports = function (db) {
  var api = require('./routes/api')(db);
  var routes = require('./routes/index')(db);
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

  // User

  app.get('/', routes.index);

  app.get('/getAllUsers', routes.getAllUsers);

  app.post('/uniqueCheck', routes.uniqueCheck);

  app.post('/regist', routes.regist);

  app.post('/deleteUser', routes.deleteUser);

  app.post('/editUser', routes.editUser);

  app.post('/editUserPassword', routes.editUserPassword);

  app.post('/signin', routes.signin);

  app.all('/logout', routes.logout);

  // Blog

  /*检查是否登录*/
  app.get('*', routes.checkLogin);

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

  return app;
}

