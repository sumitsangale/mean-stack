const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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
  const post = req.body;
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
