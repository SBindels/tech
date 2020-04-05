const express = require("express");
//const app = express();
const mongodb = require("mongodb");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRound = 10;
const port = process.env.port || 5000;

require("dotenv").config();

let data = {
  title: "datingapp",
  page: "Registratie",
  name: "Sjoerd"
};

let database = null;

const url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;

mongodb.MongoClient.connect(url, function(err, client) {
  if (err) {
    throw err;
    console.log("unable to connect to db");
  }

  database = client.db(process.env.DB_NAME);
  console.log("successfully connected to db");
});

express()
  .use(express.static("public"))
  .set("view engine", "ejs")
  .set("views", "view")
  .use(bodyparser.urlencoded({ extended: true }))
  .post("/registerUser", add)
  .get("/", gebruikers)
  .get("/registratie", Registratieform)
  .get("/login", loginForm)
  .get("/login", compareCredentials)
  .get("/loginDone", compareCredentials)
  .get("/loginFailed", compareCredentials)
  .use(pageNotFound)
  .listen(5000);

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/registratie", (req, res) => {
//   res.render("registratie.ejs", { data });
//   collection.insertOne({ naam: "sjoerd" });
//   console.log(collection);
// });

//app.post("/registratie", (req, res) => {});

// VAN TESS
function gebruikers(req, res, next) {
  database
    .collection("users")
    .find()
    .toArray(done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render("login.ejs", { data: data });
    }
  }
}

function loginForm(req, res) {
  res.render("login.ejs", { data });
}

function Registratieform(req, res) {
  res.render("registratie.ejs", { data });
}

function add(req, res, next) {
  database.collection("users").insertOne(
    {
      naam: req.body.voornaam,
      email: req.body.emailadres,
      wachtwoord: req.body.wachtwoord
    },
    done
  );
  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect("/login");
    }
  }
}

function compareCredentials(req, res) {
  database.collection("users").findOne({ email: req.body.emailadres }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      if (data.wachtwoord === req.body.wachtwoord) {
        console.log("succesvol ingelogd :)");
        res.render("/loginDone");
      } else {
        console.log("login mislukt :(");
        res.render("/loginFailed");
      }
    }
  }
}

function pageNotFound(req, res) {
  res.render("404.ejs");
}

//Server online notice: node server.js
//express.listen(port, () => console.log(`Server started on port ${port}`));
