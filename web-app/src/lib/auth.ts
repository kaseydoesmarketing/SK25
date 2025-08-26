import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isPro: user.isPro,
          usageMinutes: user.usageMinutes,
          stripeCustomerId: user.stripeCustomerId,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Add custom user fields if needed
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            isPro: true,
            usageMinutes: true,
            stripeCustomerId: true,
          }
        });
        
        if (userData) {
          session.user.isPro = userData.isPro;
          session.user.usageMinutes = userData.usageMinutes;
          session.user.stripeCustomerId = userData.stripeCustomerId;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email);
      // Initialize user with free tier settings
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPro: false,
            usageMinutes: 0,
            createdAt: new Date(),
          }
        });
      }
    },
  },
};