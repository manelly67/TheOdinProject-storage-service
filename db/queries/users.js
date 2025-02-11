const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const passwordRequirements =
  "Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters";

async function createUser(req, res, hashedPassword) {
  await prisma.user
    .create({
      data: {
        email: `${req.body.email}`,
        username: `${req.body.username}`,
        password: `${hashedPassword}`,
      },
    })
    .then(async () => {
      const userCreated = await getUserFromUsername(req.body.username);
      const userId = userCreated.id;
      // create the main folder My Storage for the new user
      await prisma.folders.create({
        data: {
          name: 'My Storage',
          ownerId: userId,
          parentFolder: null,
        },
      });
      const mainFolderId = await findMainFolderId(userId);
      const contentObject = {
        my_storage : {
          id : mainFolderId,
          content : {
            arrayFolders : [],
            arrayFiles : [],
          },
        }
      };
      // create the upload object with My Storage folder
      await prisma.uploads.create({
        data: {
          ownerId: userId,
          content: contentObject,
        },
      });
      await prisma.$disconnect();
      res.redirect("/");
    })
    .catch(async (err) => {
      if (err.code === "P2002") {
        const errFields = [
          { msg: `fields [ ${err.meta.target}] is already taken.` },
        ];
        return res.status(400).render("sign-up-form", {
          title: "New User",
          user: req.user,
          passwordRequirements: passwordRequirements,
          errors: errFields,
        });
      } else {
        await prisma.$disconnect();
        process.exit(1);
      }
    });
}

const getUserFromUsername = async (username) => {
  return await prisma.user
    .findUnique({
      where: { username: username },
      include: {
        uploads: true,
      },
    });
};

const getUserFromId = async(id) => {
  return await prisma.user
  .findUnique({
    where: {
      id: Number(id),
    },
    include: {
      uploads: true,
    },
  });
};

const findMainFolderId = async(arg) => {
  const [row ] = await prisma.folders
    .findMany({
      where: {
        AND: {
          ownerId: {
            equals: Number(arg),
          },
          name: {
            equals: 'My Storage',
          },
        },
      },
    });
  return row.id;

};

module.exports = {
  createUser,
  getUserFromUsername,
  getUserFromId,
};
