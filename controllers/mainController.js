async function getHomePage(req,res) {
    res.render('index',{title:'UPLOADER | HOME'});
}

module.exports = {
getHomePage,
}