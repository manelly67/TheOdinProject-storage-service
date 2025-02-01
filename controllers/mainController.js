async function getHomePage(req, res) {
  res.render("index", { title: "UPLOADER | HOME" });
};


async function loginGet(req, res) {
    switch (req.isAuthenticated()) {
      case false:
        res.render("log-in-form", {
            title: "UPLOADER | LOGIN",
            user: req.user,
            errors: req.session.messages,
          });
        break;
      case true:
        res.render("ask-for-logout", {
          title: "Logout Required",
          user: req.user,
          text: "You are already Login - Logout here is you want:",
        });
        break;
    }
  };
  

module.exports = {
  getHomePage,
  loginGet,
};
