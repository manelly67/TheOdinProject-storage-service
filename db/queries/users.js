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

module.exports = {
  createUser,
  getUserFromUsername,
  getUserFromId,
};
