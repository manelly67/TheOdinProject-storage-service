/* const { Prisma } = require("@prisma/client/extension"); */
const db = require("../db/queries/files_uploads");
const { body, validationResult } = require("express-validator");


async function addFolderGet(req, res) {
  const { my_storage } = req.user.uploads[0].content;
  res.render("folders_view", {
    title: "UPLOADER | FOLDERS",
    my_storage,
  });
}

// add-folder POST form validation

const lengthErr = "must be between 1 and 30 characters.";
const nameErr = "My Storage is a reserved name, select another name.";
const validateUser = [
  body("my_folder")
    .trim()
    .escape()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Folder name ${lengthErr}`)
    .custom((value) => {
      return value.toLowerCase() !== "my storage";
    })
    .withMessage(nameErr),
];

const addFolderPost = [
  validateUser,
  async (req, res) => {
    const { my_storage } = req.user.uploads[0].content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("folders_view", {
        title: "UPLOADER | FOLDERS",
        my_storage,
        errors: errors.array(),
      });
    }
    
    await db.addNewFolder(req, res);
    await db.updateMyStorageObject(req,res);
    res.render("folders_view", {
      title: "UPLOADER | FOLDERS",
      my_storage,
    });
  },
];

async function foldersGet(req,res) {
  const { my_storage } = req.user.uploads[0].content;
  res.render("list_folders", {    
    title: "UPLOADER | FOLDERS",
    my_storage,
  });
}

async function updateFolderGet(req,res) {
  const { id } = req.params;
  const folderData = await db.getFolderFromId(id);
  const parentFolder = await db.getFolderFromId(Number(folderData.parentFolder));
  const { my_storage } = req.user.uploads[0].content;
  res.render("update-folders", {    
    title: "UPLOADER | UPDATE FOLDERS",
    idFolder: id,
    folderData,
    parentFolder,
    my_storage,
  });
}

// use same validation for create folder

const updateFolderPost = [
  validateUser,
  async (req, res) => {
    const { id } = req.params;
    const { my_storage } = req.user.uploads[0].content;
    const folderData = await db.getFolderFromId(id);
    const parentFolder = await db.getFolderFromId(Number(folderData.parentFolder));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("update-folders", {
        title: "UPLOADER | UPDATE FOLDERS",
        idFolder: id,
        folderData,
        parentFolder,
        my_storage,
        errors: errors.array(),
      });
    }
    await db.updateFolder(id, req, res);
    await db.updateMyStorageObject(req,res);
    res.redirect('/storage/update_folder');
  }
];


// INVESTIGAR COMO BORRAR LOS ARCHIVOS DEL FILE SAVER Y COMO HACER DOWNLOAD

async function deleteFolderGet(req, res) {
  const { id } = req.params;
  const folderData = await db.getFolderFromId(id);
  const filesinFolder = await db.getFilesInTheFolder(id);
  const foldersinFolder = await db.getFoldersInTheFolder(id);
  
  let canBeDeleted = false;
  if(filesinFolder.length===0 && foldersinFolder.length===0){
    canBeDeleted = true;
  }
 
  res.render("delete_folder", {
    title: "UPLOADER | DELETE FOLDERS",
    idFolder: id,
    name: folderData.name,
    canBeDeleted,
  });
}

async function deleteFolderPost(req, res) {
  const { id } = req.params;
  await db.deleteFolderFromId(id);
  await db.updateMyStorageObject(req,res);
  res.redirect('/storage/update_folder');
}

module.exports = {
  addFolderGet,
  addFolderPost,
  foldersGet,
  updateFolderGet,
  updateFolderPost,
  deleteFolderGet,
  deleteFolderPost,
};
