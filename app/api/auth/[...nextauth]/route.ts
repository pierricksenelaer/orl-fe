import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CognitoProvider from "next-auth/providers/cognito";
import { hash } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 900
  },
  jwt: {
    maxAge: 900
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID as string,
      clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
      issuer: process.env.COGNITO_ISSUER as string,
      // authorization: {
      //   params: {
      //     scope: "openid email profile",
      //     response_type: "code"
      //   }
      // },
      checks: ['nonce'],
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
          include: {
            userPreference: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          image: user?.userPreference?.avatar,
        };
      },
    }),
  ],
  // cookies: {
  //   nonce: {
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "lax",
  //     maxAge: 900
  //   }
  // },
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          isAdmin: token.isAdmin,
          name: token.name,
          email: token.email,
          image: token.picture,
        },
      };
    },
    jwt: async ({ token, user, trigger, session, account }) => {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email as string,
        },
        include: {
          userPreference: true,
        },
      });

      if (!dbUser) {
        // Create a new user in the database for first time github login
        // console.log('create~~~~~~~~~~~~~~~', token)
        const hashedPassword = await hash(generateRandomPassword(12), 10);
        const createdUser = await prisma.user.create({
          data: {
            name: "Cognito User " + token.email,
            email: token.email as string,
            password: hashedPassword,
            // userPreference: {
            //   create: {
            //     avatar: token.picture,
            //   },
            // },
          },
          // include: {
          //   userPreference: true,
          // },
        });
        token.id = createdUser.id;
        token.isAdmin = false;
      } else {
        token.id = dbUser.id;
        token.isAdmin = dbUser.isAdmin;
      }

      if (trigger === "update") {
        token.name = session.name;
      }

      return token;
    },
  },
  debug: true
};

//todo solve avatar problem

const generateRandomPassword = (length: number) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
