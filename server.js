const express = require("express");
const ejs = require("ejs");

const app = express();

//const variable voor PORT
const port = process.env.port || 5000;

let data = {
  title: "datingapp",
  page: "Registratie",
  name: "Sjoerd"
};

app
  .use(express.static("public"))
  .set("view engine", "ejs")
  .set("views", "view");

app.get("/registratie", (req, res) => {
  res.render("registratie.ejs", { data });
});

app.get("*", (req, res) => {
  res.send("Error! 404 this route doesn't exist");
});

//Server online notice: node server.js
app.listen(port, () => console.log(`Server started on port ${port}`));
