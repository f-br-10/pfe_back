const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const AuthRoutes = require ("./router/authRoute.js");
const UserRoutes = require ("./router/userRoutes.js");
const serviceroute = require ("./router/serviceRoute.js");
const settingsRoutes = require ("./router/settingsRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
dotenv.config();

app.listen(port, () => console.log("le serveur a demarré au port " + port))


app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/service", serviceroute);
app.use("/api/settings", settingsRoutes);




//Connect with DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((error) => {
    console.log(error.message);
  });




  