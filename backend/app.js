const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoute = require('./routes/posts');
const userRoute = require('./routes/users');

const app = express();
const password = "Vh1Jmlex5FHG8GVF";
const userName = "sumitsangale126";

mongoose.connect("mongodb+srv://sumitsangale126:" + process.env.MONGO_ATLAS_PW + "@angular-node.9xn9fib.mongodb.net/?retryWrites=true&w=majority").then(()=>{
  console.log("connected successfully to mongoDB");
}).catch(()=>{
  console.log("connection fail to mongoDB");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, resp, next) => {
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader(
    "Access-Control-Allow-Headers",
    "origin, Content-Type, x-requested-with, Accept, Authorization"
  );
  resp.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET,PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoute);
app.use("/api/users", userRoute);


module.exports = app;
