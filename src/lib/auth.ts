// src/lib/auth.ts
import NextAuth, { DefaultSession, NextAuthOptions, getServerSession, DefaultUser } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db"; // Assuming your prisma client is exported from src/lib/db.ts
                               // Adjust this path if your prisma client is elsewhere.
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // debug: true,
  // events: {
  // async createUser({ user }) {
  //   console.log("🆕 User created:", user);
  // },
  // async linkAccount({ user, account }) {
  //   console.log("🔗 Account linked:", account);
  // },
  // async signIn(data) {
  //   console.log("🔐 Sign-in event:", data);
  // },
  //  },  
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          return null;
        }
        // Ensure Account exists for credentials
        let account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "credentials",
          },
        });
        if (!account) {
          await prisma.account.create({
            data: {
              userId: user.id,
              type: "credentials",
              provider: "credentials",
              providerAccountId: user.email,
            },
          });
          // Re-fetch user to ensure all relations are up to date
          user = await prisma.user.findUnique({ where: { email: credentials.email } });
        }
        if (!user) {
          return null;
        }
        // Return user object with required fields for Prisma Adapter
        const userObj = {
          id: user.id, 
          name: user.name || null,
          email: user.email || null,
          image: user.image || null,
        } satisfies DefaultUser;
        return userObj;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | undefined;
        session.user.email = token.email as string | undefined;
        session.user.image = token.image as string | undefined; 
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
