import cors from '@fastify/cors';
import { fastify } from './fastify';
import { guessesRoutes } from './routes/guesses';
import { poolsRoutes } from './routes/pools';
import { usersRoutes } from './routes/users';

async function bootstrap() {
  await fastify.register(cors, {
    origin: true
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

  await fastify.listen({
    port: 3333,
    // host: '0.0.0.0'
  });
}

bootstrap();