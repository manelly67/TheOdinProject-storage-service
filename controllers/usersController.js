const db = require("../db/queries/users");

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passwordValidation = require("./password_validation");

const passwordRequirements =
  "Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters";

async function newUserGet(req, res) {
  switch (req.isAuthenticated()) {
    case false:
      res.render("sign-up-form", {
        title: "UPLOADER | New User",
        user: req.user,
        passwordRequirements: passwordRequirements,
      });
      break;
    case true:
      res.render("ask-for-logout", {
        title: "Logout Required",
        user: req.user,
        text: "To create a new user you must log out of your account.",
      });
      break;
  }
}

// sign-up POST form validation
const emailErr = "must be a valid email address";
const usernameErr = "Excessive use of characters";
const passwordErr = passwordRequirements;
const confirmErr = "Confirmation password must be equal to password";

const validateUser = [
  body("email").trim().isEmail().withMessage(`Email ${emailErr}`),
  /*  .custom(async (value) => {
      const existingUser = await db.verifyMail(value);
      if (existingUser) {
        throw new Error('A user already exists with this email');
      }
    }), */
  body("username")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage(`Username has ${usernameErr}`),
  /*  .custom(async (value) => {
      const existingUser = await db.verifyUser(value);
      if (existingUser) {
        throw new Error('A user already exists with this username');
      }
    }), */
  body("user_password")
    .custom((value) => {
      return passwordValidation(value);
    })
    .withMessage(passwordErr),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.user_password;
    })
    .withMessage(confirmErr),
];

const newUserPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        title: "New User",
        user: req.user,
        passwordRequirements: passwordRequirements,
        errors: errors.array(),
      });
    }

    bcrypt.hash(req.body.user_password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      }
      // otherwise, store hashedPassword in DB
      try {
        await db.createUser(req, res, hashedPassword);
        // redirect inside prisma .then
      } catch (err) {
        return next(err);
      }
    });
  },
];

module.exports = {
  newUserGet,
  newUserPost,
};
