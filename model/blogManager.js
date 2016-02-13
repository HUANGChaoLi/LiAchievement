
module.exports = function (db) {
  var blogs = db.collection("blog");
  console.log("blogManager connect yes!!");

  return {

    getAllBlogs: function () {
      return blogs.find().toArray().then(function (allBlogs){
        return new Promise(function (resolve, reject) {
          if (allBlogs) {
            resolve(allBlogs);//here
          } else {
            reject("error in getAllBlogs");
          }
        });
      });
    },

    addBlog: function (blog_id, name, titles, contents) {
      var blog = {title: titles, id: blog_id, user: name, hide: false, content: contents, comments : []};
      return blogs.insert(blog);
    },

    deleteBlog: function (blog_id) {
      return blogs.deleteOne({id: blog_id});
    },

    editBlog: function (blog_id, titles, contents) {
      return blogs.updateOne({id: blog_id}, {$set: {title: titles, content: contents}});
    },

    addComment: function (blog_id, name, comment_id, contents) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject){
          if (blog) {
            var Comments = blog.comments;
            var comment = {user: name, id: comment_id, hide: false, content: contents};
            Comments.push(comment);
            blogs.updateOne({id: blog_id}, {$set: {comments : Comments}}).then(resolve);
          } else {
            reject("error in addComment");
          }
        });
      });
    },
    
    editComment: function (blog_id, comment_id, contents) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject){
          if (blog) {
            var Comments = blog.comments;
            for (var i = 0; i < Comments.length; i++) {
              if (Comments[i].id == comment_id) {
                Comments[i].content = contents;
                break;
              }
            }
            if (i != Comments.length) {
              blogs.updateOne({id: blog_id}, {$set: {comments : Comments}}).then(resolve);
            } else {//不知
              console.log("不知错误");
              reject("error in editComment");
            }
          } else {
            reject("error in editComment");
          }
        });
      });
    },

    deleteComment: function (blog_id, comment_id) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject){
          if (blog) {
            var Comments = blog.comments;
            for (var i = 0; i < Comments.length; i++) {
              if (Comments[i].id == comment_id) {
                break;
              }
            }
            if (i != Comments.length) {
              Comments.splice(i, 1);
              blogs.updateOne({id: blog_id}, {$set: {comments : Comments}}).then(resolve);
            } else {//不知
              console.log("不知错误");
              reject("error in editComment");
            }
          } else {
            reject("error in deleteComment");
          }
        });
      });
    },

    lockBlog: function (blog_id) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject) {
          if (blog) {
            blogs.updateOne({id: blog_id}, {$set: {hide: true}}).then(resolve);
          } else {
            reject("error in lockBlog");
          }
        });
      });
    },

    unlockBlog: function (blog_id) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject) {
          if (blog) {
            blogs.updateOne({id: blog_id}, {$set: {hide: false}}).then(resolve);
          } else {
            reject("error in unlockBlog");
          }
        });
      });
    },

    lockComment: function (blog_id, comment_id) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject) {
          if (blog) {
            var Comments = blog.comments;
            for (var i = 0; i < Comments.length; i++) {
              if (Comments[i].id == comment_id) {
                break;
              }
            }
            if (i != Comments.length) {
              Comments[i].hide = true;
              blogs.updateOne({id: blog_id}, {$set: {comments : Comments}}).then(resolve);
            } else {//不知
              console.log("不知错误");
              reject("error in lockComment");
            }
          } else {
            reject("error in lockComment");
          }
        });
      });
    },

    unlockComment: function (blog_id, comment_id) {
      return blogs.findOne({id: blog_id}).then(function (blog) {
        return new Promise(function (resolve, reject) {
          if (blog) {
            var Comments = blog.comments;
            for (var i = 0; i < Comments.length; i++) {
              if (Comments[i].id == comment_id) {
                break;
              }
            }
            if (i != Comments.length) {
              Comments[i].hide = false;
              blogs.updateOne({id: blog_id}, {$set: {comments : Comments}}).then(resolve);
            } else {//不知
              console.log("不知错误");
              reject("error in unlockComment");
            }
          } else {
            reject("error in unlockComment");
          }
        });
      });
    }

  };
}