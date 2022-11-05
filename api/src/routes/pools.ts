import { fastify } from "../fastify";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { prisma } from "../prisma";
import { authenticate } from "../plugins/authenticate";


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

    try {
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,
          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      });
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      });
    }

    return reply.status(201).send({
      code
    });
  });

  fastify.post('/pools/join', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const createPoolBodyValidator = z.object({
      code: z.string(),
    });
    const { code } = createPoolBodyValidator.parse(request.body);
    const pool = await prisma.pool.findUnique({
      where: {
        code
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub
          }
        }
      }
    });

    if (!pool) {
      return reply.status(404).send({
        message: 'Pool not found'
      });
    }

    if (pool.participants.length > 0) {
      return reply.status(400).send({
        message: 'You already joined this pool.'
      });
    }

    if (!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id
        },
        data: {
          ownerId: request.user.sub
        }
      });
    }

    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: request.user.sub
      }
    });

    return reply.status(201).send();
  });

  fastify.get('/pools/me', {
    onRequest: [authenticate]
  }, async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub
          }
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      pools,
      count: pools.length
    };
  });

  fastify.get('/pools/:id', {
    onRequest: [authenticate]
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string(),
    });
    const { id } = getPoolParams.parse(request.params);

    const pool = await prisma.pool.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      pool,
    };
  });
}

export {
  poolsRoutes
};