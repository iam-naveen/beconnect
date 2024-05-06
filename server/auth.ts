import NextAuth, {
  NextAuthConfig,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { createNewUser, getUserFromDb } from "./queries/user";
import { ZodError } from "zod";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthConfig = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          let user = null;
          const { email, password } = await signInSchema.parseAsync(credentials)
          user = await getUserFromDb(email, password)
          if (!user) {
            user = await createNewUser(email, password)
          }
          return user;
        }
        catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          else {
            throw error;
          }
        }
      }
    })
  ],
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
