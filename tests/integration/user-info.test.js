import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createToken from '../factories/tokenFactory.js';

beforeAll(async () => await clearUsers());

const request = supertest(app);

describe('GET /user-info', () => {
  it('should return 401 when not sending token', async () => {
    const result = await request.get('/user-info');

    expect(result.status).toEqual(401);
  });

  it('should return 401 when not sending token via x-access-token', async () => {
    const { token } = await createToken();

    const result = await request.get('/user-info').set('Authorization', token);

    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending token via x-access-token, but has no subscription', async () => {
    const { token } = await createToken();

    const result = await request.get('/user-info').set('x-access-token', token);

    expect(result.status).toEqual(401);
  });
});
