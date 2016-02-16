
module.exports = function (db){
  var blogManager = require("../model/blogManager")(db);
  console.log("api connect yes!!");

  return {

    getAdminName: function (req, res) {
      res.end("Administrator");
    },

    getAllBlogs: function (req, res) {
      blogManager.getAllBlogs()
        .then(function (data){
          res.json(data);
        })
        .catch(function (err){
          console.log(err);
          res.status(404).end();
        });
    },

    addComment: function (req, res) {
      var data = req.body;
      var id = new Date().getTime();//设置commentid
      blogManager.addComment(data.blog_id, data.username, id, data.contents)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          console.log(err);
          res.status(404).end();
        });
    },

    addBlog: function (req, res) {
      var data = req.body;
      var id = new Date().getTime();//设置blogid
      blogManager.addBlog(id, data.username, data.title, data.contents)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    deleteBlog: function (req, res) {
      var data = req.body;
      blogManager.deleteBlog(data.blog_id)
        .then(function (){
          res.end();
        })
        .catch(function (){
          res.status(404).end();
        })
    },

    editBlog: function (req, res) {
      var data = req.body;
      blogManager.editBlog(data.blog_id, data.title, data.contents)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    editComment: function (req, res) {
      var data = req.body;
      blogManager.editComment(data.blog_id, data.comment_id, data.contents)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    deleteComment: function (req, res) {
      var data = req.body;
      blogManager.deleteComment(data.blog_id, data.comment_id)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    lockBlog: function (req, res) {
      var data = req.body;
      blogManager.lockBlog(data.blog_id)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    unlockBlog: function (req, res) {
      var data = req.body;
      blogManager.unlockBlog(data.blog_id)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    lockComment: function (req, res) {
      var data = req.body;
      blogManager.lockComment(data.blog_id, data.comment_id)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    },

    unlockComment: function (req, res) {
      var data = req.body;
      blogManager.unlockComment(data.blog_id, data.comment_id)
        .then(function (){
          res.end();
        })
        .catch(function (err){
          res.status(404).end();
        });
    }

  };
}
