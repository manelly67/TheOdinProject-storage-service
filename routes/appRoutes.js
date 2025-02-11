const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const db = require("../db/queries/users");

const mainController = require("../controllers/mainController");
const userController = require("../controllers/usersController");
const uploadController = require("../controllers/uploadController");
const foldersController = require("../controllers/foldersController");
const { isAuth, clearMessages } = require("./authMiddleware");

router.get("/", mainController.getHomePage);

router.get("/sign-up", userController.newUserGet);
router.post("/sign-up", userController.newUserPost);

router.get("/login-required", mainController.askForLogin);

router.get("/storage", isAuth, mainController.getStoragePage);
router.get("/storage/upload_file", isAuth, uploadController.addFileGet);
router.post("/storage/upload_file", isAuth, upload.single('my_upload') , uploadController.addFilePost);
router.get("/storage/create_folder", isAuth, foldersController.addFolderGet);
router.post("/storage/create_folder", isAuth, foldersController.addFolderPost);
router.get("/storage/update_folder",isAuth,foldersController.foldersGet);

router.get("/update_folder/:id",isAuth,foldersController.updateFolderGet);
router.post("/update_folder/:id",isAuth,foldersController.updateFolderPost);

router.get("/delete_folder/:id",isAuth,foldersController.deleteFolderGet);
router.post("/delete_folder/:id",isAuth,foldersController.deleteFolderPost);

router.get("/download/:id",isAuth,uploadController.downloadFile);



// routes to authenticate
router.get("/log-in", mainController.loginGet);

// the following routes require password.js
router.post(
  "/log-in",
  clearMessages,
  passport.authenticate("local", {
    successRedirect: "/storage",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Las tres funciones requeridas para el funcionamiento de passport.js

passport.use(
  new LocalStrategy(async (username, password, done) => {
    //passport need this names (username and password) in the login form

    try {
      const user = await db.getUserFromUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserFromId(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = router;
