'use server'

import { sql } from '@vercel/postgres';
import {
  Request,
  Provider
} from './definitions';

import { unstable_noStore } from 'next/cache';

export async function acceptRequest(id:string | undefined) {
  try {
    unstable_noStore();

    await sql`UPDATE requests SET status = 'accepted' WHERE id = ${id} AND status = 'pending'`
    
  } catch(err) {
    console.error('Database Error:', err);
  }
  
}

export async function fetchConsumerRequests(id: string | undefined, status: string) {
  try {
    unstable_noStore();

    const data = await sql<Request>`SELECT * from requests WHERE consumerId = ${id} AND status = ${status}`

    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
  }
}

export async function fetchProviderRequests(id: string | undefined, status: string) {
  try {
    unstable_noStore();

    const data = await sql<Request>`SELECT * from requests WHERE providerId = ${id} AND status = ${status}`

    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
  }
}

export async function fetchProviders(query: string) {
  try {
    const data = await sql<Provider>`SELECT id, name, email, phone, title, age, interesteddomains, expertise, description from providers WHERE description ILIKE ${`%${query}%`}`
    
    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
  }
}

export async function fetchProvider(id: string) {
  try {
    const data = await sql<Provider>`SELECT * from providers WHERE providers.id = ${id}`;
    return data.rows
  } catch(err) {
    console.error('Database Error:', err);
  }
}