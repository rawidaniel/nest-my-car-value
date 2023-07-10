const dbConfig = {
  synchronize: true,
};

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case 'development':
    console.log('development');
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      // migrations: ['src/migration/*.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unkonown environment');
}

module.exports = dbConfig;
