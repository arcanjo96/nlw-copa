import cors from '@fastify/cors';
import { fastify } from './fastify';
import jwt from '@fastify/jwt';

import { authRoutes } from './routes/auth';
import { guessesRoutes } from './routes/guesses';
import { poolsRoutes } from './routes/pools';
import { usersRoutes } from './routes/users';
import { gamesRoutes } from './routes/games';

async function bootstrap() {
  await fastify.register(cors, {
    origin: true
  });

  await fastify.register(jwt, {
    secret: 'nlwcopa'
  });

  await fastify.register(guessesRoutes, {
    prefix: 'guesses'
  });
  await fastify.register(poolsRoutes, {
    prefix: 'pools'
  });
  await fastify.register(usersRoutes, {
    prefix: 'users'
  });
  await fastify.register(authRoutes, {
    prefix: 'auth'
  });
  await fastify.register(gamesRoutes, {
    prefix: 'games'
  });

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0'
  });
}

bootstrap();