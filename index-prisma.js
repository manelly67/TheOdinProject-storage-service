const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const sessions = await prisma.session.findMany();

    console.log(sessions);
     /* 
     
     const allUsers = await prisma.user.findMany({
        include: {
          uploads: true,
        },
      })
      console.dir(allUsers, { depth: null }) 
     
     const username = 'primerusuario';
      const user = await prisma.user.findUnique({
        where: { username: username},
        include: {
          uploads: true,
        },
      })
      console.log(user); */

    }

    main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })




    /*{
  code: 'P2002',
  clientVersion: '6.3.0',
  meta: { modelName: 'User', target: [ 'email' ] }
} */