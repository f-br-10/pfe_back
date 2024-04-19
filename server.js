const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const AuthRoutes = require ("./router/authRoute.js");
const UserRoutes = require ("./router/userRoutes.js");
const app = express();

const port = 3000;
dotenv.config();

app.listen(port, () => console.log("le serveur a demarré au port " + port))


app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);


//Connect with DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((error) => {
    console.log(error.message);
  });




  