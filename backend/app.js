const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');

const postsRoute = require('./routes/posts');
const userRoute = require('./routes/users');
const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/iamges")));

mongoose.connect('mongodb+srv://kumarvits15:'+ process.env.MONGO_ATLAS_PW +'@cluster0.nydzj.mongodb.net/node-posts?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log("Mongo connection is successful");
})
.catch(() => {
  console.log("Mongo connection failed!");
})

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Orign", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.setHeader("Access-Control-Allow-Metods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
})


app.use("/api/posts",postsRoute);
app.use("/api/users", userRoute);

module.exports = app;
