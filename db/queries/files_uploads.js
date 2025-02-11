const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addNewFile(req, res, secure_url) {
  await prisma.files
    .create({
      data: {
        title: `${encodeURIComponent(req.file.originalname)}`,
        size: req.file.size,
        filename: `${req.file.filename}`,
        fileURL: `${secure_url}`,
        ownerId: req.user.id,
        foldersId: Number(req.body.folder),
      },
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.log(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function addNewFolder(req, res) {
  await prisma.folders
    .create({
      data: {
        name: `${req.body.my_folder}`,
        ownerId: req.user.id,
        parentFolder: Number(req.body.parent_folder),
      },
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.log(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

const findFolderId = async (req) => {
  const [row] = await prisma.folders.findMany({
    where: {
      AND: {
        ownerId: {
          equals: Number(req.user.id),
        },
        name: {
          equals: "My Storage",
        },
      },
    },
  });
  return row.id;
};

const getFilesInTheFolder = async (id) => {
  return await prisma.files.findMany({
    where: {
      foldersId: Number(id),
    },
  });
};

const getFoldersInTheFolder = async (id) => {
  return await prisma.folders.findMany({
    where: {
      parentFolder: Number(id),
    },
  });
};

const getFolderFromId = async (id) => {
  return await prisma.folders.findUnique({
    where: {
      id: Number(id),
    },
  });
};

async function updateFolder(id, req, res) {
  await prisma.folders
    .update({
      where: {
        id: Number(id),
      },
      data: {
        name: `${req.body.my_folder}`,
        parentFolder: Number(req.body.parent_folder),
      },
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.log(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

const deleteFolderFromId = async (id) => {
  await prisma.folders
    .delete({
      where: {
        id: Number(id),
      },
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.log(err);
      await prisma.$disconnect();
      process.exit(1);
    });
};

async function updateMyStorageObject(req, res) {
  const [uploads] = req.user.uploads;

  const arrayFiles = await prisma.files.findMany({
    where: {
      ownerId: uploads.ownerId,
    },
  });
  const arrayFolders = await prisma.folders.findMany({
    where: {
      AND: [
        {
          ownerId: {
            equals: uploads.ownerId,
          },
        },
        {
          id: {
            not: uploads.content.my_storage.id,
          },
        },
      ],
    },
  });

  const updatedContent = {
    my_storage: {
      id: uploads.content.my_storage.id,
      content: {
        arrayFolders: arrayFolders,
        arrayFiles: arrayFiles,
      },
    },
  };
  await prisma.uploads
    .update({
      where: {
        id: uploads.id,
      },
      data: {
        content: updatedContent,
      },
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.log(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function getFileFromId(id,req,res) {
  return await prisma.files.findUnique({
    where:{
      id: Number(id),
    },
  });
}

module.exports = {
  addNewFile,
  addNewFolder,
  findFolderId,
  getFilesInTheFolder,
  getFoldersInTheFolder,
  getFolderFromId,
  updateFolder,
  deleteFolderFromId,
  updateMyStorageObject,
  getFileFromId,
};
