import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { Consumer, Provider } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string, typeOfUser: string | unknown): Promise<Consumer | undefined> {
  try {
    if(typeOfUser == 'consumer') {
      const user = await sql<Consumer>`SELECT * FROM consumers WHERE email=${email}`;
    return user.rows[0];
    }
    else {
      const user = await sql<Provider>`SELECT * FROM providers WHERE email=${email}`;
    return user.rows[0];
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {          
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email, credentials.userType);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);    
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks:{
    jwt: async ({ token, user }) =>{
      if (user) {
        token.uid = user;
      }
      return token
    },
    session: async ({ session, token }) => {
        session.user = {
          id: token.uid.id,
          name: token.name,
          email: token.email,
          typeofuser: token.uid.typeofuser
        }

      return session;
    },
  },
});
