const express = require("express");

const app = express();

//const variable voor PORT
const port = process.env.port || 5000;

let data = {
  title: "datingapp",
  page: "About",
  name: "Sjoerd"
};

app
  .use(express.static("public"))
  .set("view engine", "ejs")
  .set("views", "view");

app.get("/about", (req, res) => {
  res.render("about.ejs", { data });
});

app.get("*", (req, res) => {
  res.send("Error! 404 this route doesn't exist");
});

//Server online notice: node server.js
app.listen(port, () => console.log(`Server started on port ${port}`));
