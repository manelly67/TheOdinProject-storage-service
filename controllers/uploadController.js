const db = require('../db/queries/files_uploads');
const { uploadImage } = require('../db/cloud'); //cloudinary


async function addFileGet(req, res) {
  const { my_storage } = req.user.uploads[0].content;
  res.render("add-file-form", {
    title: "UPLOADER | NEW FILE",
    text: null,
    success: false,
    my_storage,
  });
}


/*  THESE IS THE ADDFILE FUCTION USIN EXPRESS express-fileupload

const { v4: uuidv4 } = require('uuid');
// Get the parent directory
const path = require("node:path");
const currentDir = __dirname;
const parentDir = path.dirname(currentDir);
const fileDir = path.join(parentDir, "upload_files/data");

async function addFilePost(req, res) {
 
  const { my_storage } = req.user.uploads[0].content;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .render("add-file-form", {
        title: "UPLOADER | NEW FILE",
        text: "No files were selected.",
        success: false,
        my_storage,
      });
  }

  // The name of the input field (i.e., "file") is used to retrieve the uploaded file
  let sampleFile = req.files.my_upload;
  // Use a secure method to generate the file name, such as using a UUID
  const fileName = encodeURIComponent(sampleFile.name);
  const fileIdentifier = uuidv4();
  // Set the path where the file will be saved
  const filePath = `${fileDir}/${fileIdentifier}`;
  console.log(filePath);

  // Move the file to the specified path
  sampleFile.mv(filePath, function (err) {
    if (err) {
      return res
        .status(500)
        .render("add-file-form", {
          title: "UPLOADER | NEW FILE",
          text: err,
          success: false,
          my_storage,
        });
    }
  });
 
  await db.addNewFile(req,res,sampleFile,filePath,fileName);
  await db.updateMyStorageObject(req,res);
  res.render("add-file-form", {
    title: "UPLOADER | NEW FILE",
    text: null,
    success: true,
    my_storage,
  });
}

*/

async function addFilePost(req, res) {  // USING MULTER
 
  const { my_storage } = req.user.uploads[0].content;
  if (!req.file || Object.keys(req.file).length === 0) {
    return res
      .status(400)
      .render("add-file-form", {
        title: "UPLOADER | NEW FILE",
        text: "No files were selected.",
        success: false,
        my_storage,
      });
  }
  const result = await uploadImage(req.file.path);
  const {secure_url}  = result;
  
  await db.addNewFile(req,res,secure_url);
  await db.updateMyStorageObject(req,res);
  res.render("add-file-form", {
    title: "UPLOADER | NEW FILE",
    text: null,
    success: true,
    my_storage,
  });
};


async function downloadFile(req,res) {
  const { id } = req.params;
  const file = await db.getFileFromId(id,req,res);

  res.download(file.fileURL, file.title, (err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        // Do something
    }
});
};



module.exports = {
  addFileGet,
  addFilePost,
  downloadFile,
};
