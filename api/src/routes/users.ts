import { fastify } from "../fastify";
import { prisma } from "../prisma";

async function usersRoutes() {
  fastify.get('/users', async () => {
    const users = await prisma.user.findMany();

    return {
      users,
      count: users.length
    };
  });
}

export {
  usersRoutes
};