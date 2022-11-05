import { FastifyInstance } from "fastify";
import { z } from "zod";
import axios from 'axios';
import { prisma } from "../prisma";
import { authenticate } from "../plugins/authenticate";

export async function gamesRoutes(fastity: FastifyInstance) {
  fastity.get(
    '/me',
    {
      onRequest: [authenticate]
    },
    async (request) => {
      return { user: request.user };
    });

  fastity.get('/pools/:id/games', {
    onRequest: [authenticate]
  },
    async (request) => {
      const getPoolParams = z.object({
        id: z.string(),
      });
      const { id } = getPoolParams.parse(request.params);

      const games = await prisma.game.findMany({
        orderBy: {
          date: 'desc'
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id
              }
            }
          }
        }
      });

      return {
        games: games.map(game => ({
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined
        }))
      };
    });
}