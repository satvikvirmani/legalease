const { db } = require('@vercel/postgres');
const {
  requests,
  providers,
  consumers,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function hashPassword(user) {
  const password = user.password;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

async function seedConsumers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS consumers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        typeOfUser TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "consumers" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding consumers:', error);
    throw error;
  }
}

async function seedProviders(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS providers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        interestedDomains TEXT NOT NULL,
        expertise VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        typeOfUser TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "providers" table`);

    // Insert data into the "users" table
    // const insertedProviders = await Promise.all(
    //   providers.map(async (provider) => {
    //     const hashedPassword = await hashPassword(provider);
    //     return client.sql`
    //     INSERT INTO providers (id, name, email, password, title, description, speciality)
    //     VALUES (${provider.id}, ${provider.name}, ${provider.email}, ${hashedPassword}, ${provider.title}, ${provider.description}, ${provider.speciality})
    //     ON CONFLICT (id) DO NOTHING;
    //   `;
    //   }),
    // );

    //console.log(`Seeded ${insertedProviders.length} providers`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding providers:', error);
    throw error;
  }
}

async function seedRequests(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS requests (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        consumerId UUID NOT NULL,
        providerId UUID NOT NULL,
        providerName VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "requests" table`);

    // Insert data into the "users" table
    // const insertedRequests = await Promise.all(
    //   requests.map(async (request) => {
    //     return client.sql`
    //     INSERT INTO requests (id, consumerId, providerId, description)
    //     VALUES (${request.id}, ${request.consumerId}, ${request.providerId}, ${request.description})
    //     ON CONFLICT (id) DO NOTHING;
    //   `;
    //   }),
    // );

    //console.log(`Seeded ${insertedRequests.length} requests`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding requests:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedConsumers(client);
  await seedProviders(client);
  await seedRequests(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
