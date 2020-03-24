const express = require("express");
const app = express();
const mongodb = require("mongodb");
const ejs = require("ejs");
const bodyparser = require("body-parser");
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
  }

  database = client.db(process.env.DB_NAME);
});

// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://" +
//   process.env.DB_USER +
//   process.env.DB_PASS +
//   ":" +
//   "@cluster0-abpqe.mongodb.net/test?retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true });
// let collection;
// client.connect(function(err, client) {
//   if (err) {
//     throw err;
//   }
//   collection = client.db("datingapp").collection("testtabel");
// });

app
  .use(express.static("public"))
  .set("view engine", "ejs")
  .set("views", "view")
  .set(bodyparser.urlencoded({ extended: true }));
// .post("./", add)
// .get("/registratie", form);

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/registratie", (req, res) => {
  res.render("registratie.ejs", { data });
  collection.insertOne({ naam: "sjoerd" });
  console.log(collection);
});

//app.post("/registratie", (req, res) => {});

// VAN TESS
function form(res, req) {
  res.render("registratie.ejs");
}

function add(res, req) {
  db.collection("users").insertOne(
    {
      naam: req.body.voornaam,
      email: req.body.emailadres,
      wachtwoord: req.body.wachtwoord
    },
    done
  );
}

function done(req, res) {
  if (err) {
    next(err);
  } else {
    res.redirect("/");
  }
}

app.get("*", (req, res) => {
  res.send("Error! 404 this route doesn't exist");
});

//Server online notice: node server.js
app.listen(port, () => console.log(`Server started on port ${port}`));

function form(req, res) {
  res.render("registratie.esj");
}
