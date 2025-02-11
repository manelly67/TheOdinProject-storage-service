/* const db = require('../db/queries/files_uploads'); */

async function getHomePage(req, res) {
  res.render("index", { title: "UPLOADER | HOME" });
}

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
}

async function getStoragePage(req, res) {
  const { my_storage } = req.user.uploads[0].content;
  const files = my_storage.content.arrayFiles;
  const folders = my_storage.content.arrayFolders;

  let rows = [];
  files.forEach((file) => {
    let folderName = 'My Storage';
    if (Number(file.foldersId)!==my_storage.id){
      let [folder ] = folders.filter((e)=> Number(file.foldersId) === Number(e.id));
      folderName = folder.name;
    }
    const row = {
      id: file.id,
      title: file.title,
      updatedAt: file.updatedAt,
      size: file.size,
      folder: folderName,
    };
  rows.push(row);
  });

  res.render("storage", {
    title: "UPLOADER | STORAGE",
    my_storage,
    rows,
    formatDate,
    formatFileSize,
  });
}

async function askForLogin(req, res) {
  res.render("ask-for-login", { title: "UPLOADER | LOGIN REQUIRED" });
}

// formatting functions
const formatDate = (arg) => {
  const dateFromString = Date.parse(arg, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return new Date(dateFromString).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function formatFileSize(bytes, decimalPoint) {
  const k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}



module.exports = {
  getHomePage,
  loginGet,
  getStoragePage,
  askForLogin,
};
