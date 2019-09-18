module.exports = {
    client: 'postgresql',
    connection: 'postgres://stcpzipp:INM3kCtjGv8ecgBbhgEtMUoZDjMQo21q@raja.db.elephantsql.com:5432/stcpzipp',
    /*
    connection: {
      database: 'stcpzipp',
      user:     'stcpzipp',
      password: 'INM3kCtjGv8ecgBbhgEtMUoZDjMQo21q'
    },
    */
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
