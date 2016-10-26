module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/accionet_test',
    migrations: {
      directory: __dirname + '/server/db/migrations',
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/test',
    },
    acquireConnectionTimeout: 10000,
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/accionet',
    migrations: {
      directory: __dirname + '/server/db/migrations',
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/development',
    },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/server/db/migrations',
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/production',
      acquireConnectionTimeout: 10000,
    },
  },
};
