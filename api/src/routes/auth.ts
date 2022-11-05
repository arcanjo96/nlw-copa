import { FastifyInstance } from "fastify";
import { z } from "zod";
import axios from 'axios';
import { prisma } from "../prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastity: FastifyInstance) {
  fastity.get(
    '/me',
    {
      onRequest: [authenticate]
    },
    async (request) => {
      return { user: request.user };
    });

  fastity.post('/users', async (request) => {
    const createUserBody = z.object({
      accessToken: z.string(),
    });

    const { accessToken } = createUserBody.parse(request.body);
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userData = await userResponse.data;
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    });

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture
        }
      });
    }

    const token = fastity.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: '7 days'
    });

    return { token };
  });
}