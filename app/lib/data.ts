'use server'

import { sql } from '@vercel/postgres';
import {
  Request,
  Provider
} from './definitions';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';

export async function acceptRequest(id:string | undefined) {
  try {
    unstable_noStore();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(
      'at accept', id);
    

    await sql`UPDATE requests SET status = 'accepted' WHERE id = ${id} AND status = 'pending'`
    
  } catch(err) {
    console.error('Database Error:', err);
    throw new Error('Failed updation.');
  }
  
}

export async function fetchPendingConsumerRequests(id: string | undefined) {
  unstable_noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Request>`SELECT * from requests WHERE consumerId = ${id} AND status = 'pending'`

    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch requests.');
  }
}

export async function fetchPendingProviderRequests(id: string | undefined, status: string) {
  unstable_noStore();

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(process.env.POSTGRES_URL)

    const data = await sql<Request>`SELECT * from requests WHERE providerId = ${id} AND status = ${status}`

    console.log(status ,data.rows);
    

    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch requests.');
  }
}

export async function fetchProviders(query: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await sql<Provider>`SELECT id, name, email, phone, title, age, interesteddomains, expertise, description from providers WHERE description ILIKE ${`%${query}%`}`
    console.log("hjkdasjkhdsajk");
    
    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch requests.');
  }
}

export async function fetchProvider(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await sql<Provider>`SELECT * from providers WHERE providers.id = ${id}`;
    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch requests.');
  }
}