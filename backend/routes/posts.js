const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Post = require('../models/post');

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", checkAuth, multer({storage: storage}).single("image"), (req, resp, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((result)=>{
      resp.status(201).json({
        message: "post added successfully",
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
          creator: result.creator
        }
      });
    }).catch((error)=>{
      resp.status(500).json({
        message: "creating post failed!"
      })
    })
  
  });

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, resp, next)=>{
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((result)=>{
      if (result.modifiedCount > 0){
        resp.status(200).json({message: "updated successfully!"});
      } else {
        resp.status(401).json({ message: "Not authorized!" });
      }
    }).catch((error)=>{
      resp.status(500).json({
        message: "Could't update post!"
      })
    });
});
  
router.get("", (req, resp, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if(pageSize && currentPage){
      postQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize);
    }
    postQuery.then((documents)=>{
      fetchedPost = documents;
        return Post.count();
        
    }).then((count)=>{
      resp.status(200).json({
        message: "data received successfully",
        posts: fetchedPost,
        maxPosts: count
      });
    }).catch((error)=>{
      resp.status(500).json({
        message: "Fetching posts failed!"
      })
    })
  });

router.get("/:id", (req, resp, next)=>{
    Post.findById(req.params.id).then((post)=>{
        if(post){
            resp.status(200).json(post);
        } else {
            resp.status(404).json({message: "post not found!"});
        }
    }).catch((error)=>{
      resp.status(500).json({
        message: "Fetching posts failed!"
      })
    })
})
  
router.delete("/:id", checkAuth, (req, resp, next)=>{
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result)=>{
      console.log("delete post", result);
      if (result.deletedCount > 0){
        resp.status(200).json({
          message: "post deleted!"
        });
      } else {
        resp.status(401).json({ message: "Not authorized!" });
      }
    }).catch((error)=>{
      resp.status(500).json({
        message: "Deleting posts failed!"
      })
    });
  })

module.exports = router;