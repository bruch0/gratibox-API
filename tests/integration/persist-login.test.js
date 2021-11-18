import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createToken from '../factories/tokenFactory.js';

beforeAll(async () => await clearUsers());

const request = supertest(app);

describe('POST /persist-login', () => {
  it('should return 401 when not sending token', async () => {
    const result = await request.post('/persist-login');
    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending empty body', async () => {
    const result = await request.post('/persist-login').send({});
    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending invalid token', async () => {
    const result = await request
      .post('/persist-login')
      .send({ token: faker.datatype.uuid() });
    expect(result.status).toEqual(401);
  });

  it('should return 200 when sending valid token', async () => {
    const { token } = await createToken();
    const result = await request.post('/persist-login').send({ token });
    expect(result.status).toEqual(401);
  });
});
