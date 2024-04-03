const { db } = require('@vercel/postgres');

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
    console.error('Error creating consumers:', error);
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

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating providers:', error);
    throw error;
  }
}

async function seedRequests(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
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

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating requests:', error);
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
    'An error occurred while attempting to create the database:',
    err,
  );
});
