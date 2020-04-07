module.exports = function(app) {
  express()
    .use(express.static("public"))
    .set("view engine", "ejs")
    .set("views", "view")
    .use(bodyparser.urlencoded({ extended: true }))
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
};
