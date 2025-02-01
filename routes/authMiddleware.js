module.exports.isAuth = (req,res,next) => {
    if (req.isAuthenticated()) {
        next();
    }else{
        res.redirect('/');
    }
};

module.exports.clearMessages = (req,res,next) => {
    req.session.messages = null;
    next();
};
