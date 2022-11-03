import { fastify } from "../fastify";
import { prisma } from "../prisma";

async function guessesRoutes() {
  fastify.get('/guesses', async () => {
    const guesses = await prisma.guess.findMany();

    return {
      guesses,
      count: guesses.length
    };
  });
}

export {
  guessesRoutes
};