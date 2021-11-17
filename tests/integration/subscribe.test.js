import '../../src/setup.js';
import supertest from 'supertest';
import fakerbr from 'faker-br';
import faker from 'faker';
import RandExp from 'randexp';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createToken from '../factories/tokenFactory.js';

beforeAll(clearUsers);
afterAll(clearUsers);

const request = supertest(app);

describe('post subscribe', () => {
  const randZipcode = new RandExp(/[0-9]{8}/);
  it('should return 401 when not sending jwt', async () => {
    const result = await request.post('/subscribe');
    expect(result.status).toEqual(401);
  });

  it('should return 401 when not sending jwt via x-access-token', async () => {
    const token = await createToken();
    const result = await request.post('/subscribe').set('Authorization', token);
    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending valid body, but no jwt', async () => {
    const validBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const result = await request.post('/subscribe').send(validBody);
    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending valid body, but no jwt via x-acess-token', async () => {
    const validBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const token = await createToken();
    const result = await request
      .post('/subscribe')
      .set('Authorization', token)
      .send(validBody);
    expect(result.status).toEqual(401);
  });

  it('should return 400 when sending jwt via x-access-token, but no body', async () => {
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending plan', async () => {
    const invalidBody = {
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty plan', async () => {
    const invalidBody = {
      plan: '',
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending deliveryDate', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty deliveryDate', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: '',
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending itemsWanted', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty itemsWanted', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: '',
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending adress', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty adress', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: '',
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending zipcode', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty zipcode', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: '',
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending city', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      adress: faker.address.streetName(),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      zipcode: randZipcode.gen(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty city', async () => {
    const invalidBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: '',
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 201 when valid body and token via x-access-token', async () => {
    const validBody = {
      plan: faker.random.arrayElement(['monthly', 'weekly']),
      deliveryDate: faker.random.arrayElement(['01', '10', '20']),
      itemsWanted: faker.random.arrayElement(['1', '2', '3']),
      adress: faker.address.streetName(),
      zipcode: randZipcode.gen(),
      city: fakerbr.address.city(),
    };
    const { token } = await createToken();
    const result = await request
      .post('/subscribe')
      .set('x-access-token', token)
      .send(validBody);
    expect(result.status).toEqual(201);
  });
});

// const invalidBody = {
//   userId: '',
//   plan: faker.random.arrayElement(['monthly', 'weekly']),
//   deliveryDate: faker.random.arrayElement(['01', '10', '20']),
//   itemsWanted: faker.random.arrayElement(['1', '2', '3']),
//   adress: faker.address.streetName(),
//   zipcode: randZipcode.gen(),
//   city: fakerbr.address.city(),
// };
