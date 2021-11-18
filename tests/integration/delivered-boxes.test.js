import '../../src/setup.js';
import supertest from 'supertest';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createDelivery from '../factories/deliveryFactory.js';

beforeAll(async () => await clearUsers());

const request = supertest(app);

describe('GET /delivered-boxes', () => {
  it('should return 401 when not sending token', async () => {
    const result = await request.get('/delivered-boxes');
    expect(result.status).toEqual(401);
  });

  it('should return 401 when not sending token via x-access-token', async () => {
    const { token } = await createDelivery();
    const result = await request
      .get('/delivered-boxes')
      .set('Authorization', token);
    expect(result.status).toEqual(401);
  });

  it('should return 200 when sending token via x-access-token', async () => {
    const { token } = await createDelivery();
    const result = await request
      .get('/delivered-boxes')
      .set('x-access-token', token);
    expect(result.status).toEqual(200);
  });
});
