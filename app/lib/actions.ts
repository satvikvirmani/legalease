'use server';

import { z } from 'zod';

import { sql } from '@vercel/postgres';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

import bcrypt from 'bcrypt';

const FormSchema = z.object({
  id: z.string(),
  consumerid: z.string(),
  consumername: z.string(),
  providerid: z.string(),
  providername: z.string(),
  description: z.string(),
});

const CreateRequest = FormSchema.omit({ id: true });

export async function createRequest(formData: FormData) {
  const { consumerid, consumername, providerid, providername, description } =
    CreateRequest.parse({
      consumerid: formData.get('consumerId'),
      consumername: formData.get('consumername'),
      providerid: formData.get('providerId'),
      providername: formData.get('providerName'),
      description: formData.get('description'),
    });

  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO requests (consumerid, consumername, providerid, providername, description, status, date)
    VALUES (${consumerid}, ${consumername}, ${providerid}, ${providername}, ${description}, ${'pending'}, ${date})
  `;

  revalidatePath('/dashboard/pending');
  redirect('/dashboard/pending');
}
export async function performSignOut() {
  await signOut();
}

export async function authenticateSignIn(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
  }
}

async function hashPassword(password: string) {
  const saltRounds = 10;

  const hashedPassword = await new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

const FormSchemaConsumerSignUp = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const ConsumerSignUp = FormSchemaConsumerSignUp.omit({ id: true });

export async function authenticateConsumerSignUp(formData: FormData) {
  const { name, email, password } = ConsumerSignUp.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const hashedPassword = await hashPassword(password);

  await sql`
    INSERT INTO consumers (name, email, typeofuser, password)
    VALUES (${name}, ${email}, ${'consumer'}, ${hashedPassword})
  `;

  revalidatePath('/login');
  redirect('/login');
}

const FormSchemaProviderSignUp = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  title: z.string(),
  age: z.string(),
  interesteddomains: z.string(),
  expertise: z.string(),
  description: z.string(),
  password: z.string(),
});

const ProviderSignUp = FormSchemaProviderSignUp.omit({ id: true });

export async function authenticateProviderSignUp(formData: FormData) {
  const {
    name,
    email,
    phone,
    title,
    age,
    interesteddomains,
    expertise,
    description,
    password,
  } = ProviderSignUp.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    title: formData.get('title'),
    age: formData.get('age'),
    interesteddomains: formData.get('interesteddomains'),
    expertise: formData.get('expertise'),
    phone: formData.get('phone'),
    description: formData.get('description'),
  });

  const hashedPassword = await hashPassword(password);

  await sql`
  INSERT INTO providers (name, email, phone, title, age, interestedDomains, expertise, description, typeofuser, password)
  VALUES (${name}, ${email}, ${phone.toString()}, ${title}, ${parseInt(age)}, ${interesteddomains}, ${expertise}, ${description}, ${'provider'}, ${hashedPassword})
`;

  revalidatePath('/login');
  redirect('/login');
}
