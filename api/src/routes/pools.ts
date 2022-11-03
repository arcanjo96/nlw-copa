import { fastify } from "../fastify";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { prisma } from "../prisma";


async function poolsRoutes() {
  fastify.get('/pools', async () => {
    const pools = await prisma.pool.findMany();

    return {
      pools,
      count: pools.length
    };
  });

  fastify.post('/pools', async (request, reply) => {
    const createPoolBodyValidator = z.object({
      title: z.string(),
    });
    const { title } = createPoolBodyValidator.parse(request.body);
    const shortUniqueId = new ShortUniqueId({ length: 6 });
    const code = String(shortUniqueId()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code,
      }
    });

    return reply.status(201).send({
      code
    });
  });
}

export {
  poolsRoutes
};