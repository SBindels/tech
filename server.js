//const en require
const express = require("express");
//const app = express();
const mongo = require("mongodb");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainTextPassword = "dit_is_niet_mijn_wachtwoord";
const session = require("express-session");
const port = process.env.port || 5000;
ObjectId = require("mongodb").ObjectID;

require("dotenv").config();

//MongoDB database
let db = null;
let collectionUsers;
const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@cluster0-abpqe.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//database connect
client.connect(function (err, client) {
  if (err) {
    throw err;
  }
  collectionUsers = client.db("datingapp").collection("users");
});

let data = {
  title: "datingapp",
};

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
  .get("/", users)
  .get("/registratie", Registratieform)

  .get("/login", loginForm)

  .post("/login", compareCredentials)
  .post("/registratie", registerUser)
  .get("/loginDone", compareCredentials)
  .get("/loginFailed", compareCredentials)
  .post("/update", updatePassword)
  .use(pageNotFound)
  .listen(5000);

function users(req, res, next) {
  db.collection("users").find().toArray(done);

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
function registerUser(req, res, next) {
  db.collection("users").insertOne(
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
  db.collection("users").findOne(
    {
      email: req.body.emailadres,
    },
    done
  );

  function done(err, data) {
    // console.log(data);
    if (err) {
      next(err);
    } else {
      if (data.wachtwoord === req.body.wachtwoord) {
        console.log("succesvol ingelogd :)");
        req.session.user = data.username;
        res.redirect("/findMatch");
        // res.send("hoi");
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

  db.collection("users").updateOne(
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

console.log('test')
