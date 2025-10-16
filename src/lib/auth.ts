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

  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn(message) {
      console.log("🔐 Sign-in event:", message);
    },
    async signOut(message) {
      console.log("🚪 Sign-out event:", message);
    },
    async session(message) {
      console.log("📋 Session event:", message);
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
          prompt: "select_account", // Force account selection
          access_type: "offline",
          response_type: "code"
        }
      }
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.pharmshift.com' : 'localhost',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
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
    async redirect({ url, baseUrl }) {
      // Handle redirects between www and non-www
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).hostname.endsWith('.pharmshift.com')) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('Sign-in attempt:', { 
        provider: account?.provider, 
        user: user?.email,
        accountType: account?.type 
      });

      // Auto-link accounts with same email
      if (account?.provider === "google" && user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        if (existingUser) {
          // Check if Google account already linked
          const googleAccount = existingUser.accounts.find(acc => acc.provider === "google");
          
          if (!googleAccount && account.providerAccountId) {
            // Link Google account to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            console.log(`✅ Linked Google account to existing user: ${user.email}`);
          }
        }
      }

      return true;
    },
  },
};
//

export const getAuthSession = () => getServerSession(authOptions);
