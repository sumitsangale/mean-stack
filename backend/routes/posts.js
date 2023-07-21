const express = require('express');
const multer = require('multer');

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

router.post("", multer({storage: storage}).single("image"), (req, resp, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save().then((result)=>{
      resp.status(201).json({
        message: "post added successfully",
        postId: result._id
      });
    });
  
  });

router.put("/:id", (req, resp, next)=>{
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then((result)=>{
        resp.status(200).json({message: "updated successfully!"});
    });
});
  
router.get("", (req, resp, next) => {
    Post.find().then((documents)=>{
        resp.status(200).json({
        message: "data received successfully",
        posts: documents,
      });
    })
  });

router.get("/:id", (req, resp, next)=>{
    Post.findById(req.params.id).then((post)=>{
        if(post){
            resp.status(200).json(post);
        } else {
            resp.status(404).json({message: "post not found!"});
        }
    })
})
  
router.delete("/:id", (req, resp, next)=>{
    Post.deleteOne({_id: req.params.id}).then((result)=>{
      console.log("delete post", result);
      resp.status(200).json({
        message: "post deleted!"
      });
    });
  })

module.exports = router;