const auth = require("../middleware/auth"); 

module.exports = app => {
  const users = require("../controllers/user.controller");

    var router = require("express").Router();

    router.post("/auth/login", users.login);

    router.post("/auth/signup", users.signUp);

    router.post("/auth/logout", auth, users.logout);

    app.use('/api', router);
  };