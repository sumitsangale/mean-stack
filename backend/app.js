const express = require("express");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const mongoose = require("mongoose");

const app = express();
const password = "Vh1Jmlex5FHG8GVF";
const userName = "sumitsangale126";

mongoose.connect("mongodb+srv://sumitsangale126:Vh1Jmlex5FHG8GVF@angular-node.9xn9fib.mongodb.net/?retryWrites=true&w=majority").then(()=>{
  console.log("connected successfully to mongoDB");
}).catch(()=>{
  console.log("connection fail to mongoDB");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, resp, next) => {
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader(
    "Access-Control-Allow-Headers",
    "origin, Content-Type, x-requested-with, Accept"
  );
  resp.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET,PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, resp, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log("request comes", post);
  resp.status(201).json({
    message: "post added successfully",
  });
});

app.get("/api/posts", (req, resp, next) => {
  const posts = [
    {
      id: "assdf958",
      title: "first post from server",
      content: "this is from server side",
    },
    {
      id: "assdf958",
      title: "second post from server",
      content: "this is from server side next post",
    },
  ];
  resp.status(200).json({
    message: "data received successfully",
    posts: posts,
  });
});

module.exports = app;
