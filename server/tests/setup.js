// Set test environment variables before any app imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRATION = '30d';
process.env.PORT = 3001;

const mongoose = require('mongoose');
let mongoServer;

// Allow slower CI environments
jest.setTimeout(30000);

beforeAll(async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;

  await mongoose.connect(mongoUri);
  console.log('✓ In-memory MongoDB started for tests');
}, 120000); // binary download can take >30s on a cold CI runner

afterEach(async () => {
  // Clean all collections between tests to keep isolation
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    console.log('✓ In-memory MongoDB stopped');
  }
});

