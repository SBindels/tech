//const en require
const express = require("express");
//const app = express();
const mongodb = require("mongodb");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainTextPassword = "dit_is_niet_mijn_wachtwoord";
const session = require("express-session");
const port = process.env.port || 5000;
ObjectId = require("mongodb").ObjectID;

require("dotenv").config();

let data = {
  title: "datingapp",
  page: "Registratie",
  name: "Sjoerd",
};

//MongoDB database
let database = null;

const url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;

mongodb.MongoClient.connect(url, { useUnifiedTopology: true }, function (
  err,
  client
) {
  if (err) {
    console.log(err);
  }

  database = client.db(process.env.DB_NAME);
  console.log("successfully connected to db");
});

//routes
express()
  .use(express.static("public")) // gebruik de template engine EJS
  .set("view engine", "ejs")
  .set("views", "view") // EJS files staan in /views
  .use(bodyparser.urlencoded({ extended: true })) // body-parser krijg je toegang tot Request body objecten zoals req.body.voornaam
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  )
  .post("/registerUser", add)
  .get("/", users)
  .get("/registratie", Registratieform)
  .get("/login", loginForm)
  .get("/login", compareCredentials)
  .get("/loginDone", compareCredentials)
  .get("/loginFailed", compareCredentials)
  .post("/update", updatePassword)
  .use(pageNotFound)
  .listen(5000);

function users(req, res, next) {
  database.collection("users").find().toArray(done);

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

//Functie dat data verzend naar mijn MongoDB database
function add(req, res, next) {
  database.collection("users").insertOne(
    {
      naam: req.body.voornaam,
      email: req.body.emailadres,
      wachtwoord: req.body.wachtwoord,
    },
    done
  );

  // //hash met bcrypt
  // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
  //   // Store hash in your password DB.
  // });

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect("/login");
    }
  }
}

//Functie voor het vergelijken van de gebruiker zijn emailadres en wachtwoord
function compareCredentials(req, res) {
  database.collection("users").findOne({ email: req.body.emailadres }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      if (req.body.wachtwoord === data.wachtwoord) {
        req.session.voornaam = data;
        console.log("succesvol ingelogd als" + data.voornaam);
        res.redirect("/loginDone");
      } else {
        console.log("login mislukt :(");
        res.redirect("/login");
      }
    }
  }
}

//update password function van Slack Inju
function updatePassword(req, res) {
  let users = req.session.emailadres;
  console.log(users._id);

  database.collection("users").updateOne(
    { _id: mongo.ObjectId(users._id) },
    {
      $set: {
        email: req.body.emailadres,
        wachtwoord: req.body.wachtwoord,
      },
    }
  );
  res.redirect("/login");
}

function pageNotFound(req, res) {
  res.render("404.ejs");
}
