var express = require("express");
const LocalStrategy = require("passport-local").Strategy;
const mongoHelper = require("./mongoHelper.js");
var router = express.Router();

module.exports = (app, passport) => {
  app.get("/", isLoggedIn, (req, res) => {
    res.redirect("/home");
  });

  app.get("/signin", (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/home");
    }

    res.sendfile("./public/signin.html");
  });

  app.get("/home", isLoggedIn, (req, res) => {
    res.sendfile("./public/home.html");
  });

  app.get("/signup", (req, res) => {
    res.sendfile("./public/signup.html");
  });

  app.get("/user", (req, res) => {
    res.json({ username: req.user });
  });

  app.get("/movies", async (req, res) => {
    const name = req.query.name;
    const year = req.query.year;

    try {
      const result = await mongoHelper.getMovies(name, year);
      res.json(result);
    } catch (err) {
      res.json({ error: err });
    }
  });

  app.get("/details/:movie_name", (req, res) => {
    res.sendfile("./public/details.html");
  });

  app.post("/details/:movie_name", (req, res) => {
    res.sendfile("./public/details.html");
  });

  router.get("/fetchcomment/:movie_name", async (req, res) => {
    movie_name = req.params.movie_name;
    console.log("router movie name " + movie_name);
    try {
      const result = await mongoHelper.getcomments(movie_name);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  });
  router.post("/addcomment/:movie_name", async (req, res) => {
    movie_name = req.params.movie_name;
    comments = req.body.comments;
    try {
      const result = await mongoHelper.addcomments(movie_name, comments);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  });
  router.get("/fetchdescription/:movie_name", async (req, res) => {
    movie_name = req.params.movie_name;
    console.log("router movie name " + movie_name);
    try {
      const result = await mongoHelper.getdescriptions(movie_name);
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  });

  app.use("/", router);

  app.post("/signin", (req, res, next) => {
    passport.authenticate("local-signin", (error, user) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (!user) {
        return res.status(401).json({});
      }

      req.login(user, (error) => {
        if (error) {
          return res.status(500).json(error);
        }
        return res.json({
          message: "successfully sign in!",
        });
      });
    })(req, res, next);
  });

  app.post("/signup", (req, res, next) => {
    passport.authenticate("local-signup", (error, user) => {
      if (error) {
        return res.status(500).json(error);
      }

      req.login(user, (error) => {
        if (error) {
          return res.status(500).json(error);
        }
        return res.json({
          message: "successfully sign up and sign in!",
        });
      });
    })(req, res, next);
  });

  app.post("/signout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  passport.use(
    "local-signin",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        mongoHelper
          .localAuth(username, password)
          .then((user) => {
            if (user) {
              console.log("LOGGED IN AS: " + user.username);
              req.session.success =
                "You are successfully logged in " + user.username + "!";
              done(null, user);
            } else {
              console.log("COULD NOT LOG IN");
              req.session.error = "Could not log user in. Please try again.";
              done(null, user);
            }
          })
          .fail((err) => {
            console.log(err.body);
            done(err.body, user);
          });
      }
    )
  );

  passport.use(
    "local-signup",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        mongoHelper
          .localReg(username, password)
          .then((user) => {
            if (user) {
              console.log("REGISTERED: " + user.username);
              req.session.success =
                "You are successfully registered and logged in " +
                user.username +
                "!";
              done(null, user);
            } else {
              console.log("COULD NOT REGISTER");
              req.session.error =
                "That username is already in use, please try a different one."; //inform user could not log them in
              done(null, user);
            }
          })
          .fail((err) => {
            console.log(err.body);
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    done(null, username);
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/signin");
    }
  }
};
