import '../../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createDelivery from '../factories/deliveryFactory.js';

beforeAll(async () => await clearUsers());

const request = supertest(app);

describe('POST /feedback', () => {
  it('should return 401 when not sending token', async () => {
    const result = await request.post('/feedback');
    expect(result.status).toEqual(401);
  });

  it('should return 401 when sending invalid token', async () => {
    const result = await request
      .post('/feedback')
      .set('x-access-token', faker.datatype.uuid());
    expect(result.status).toEqual(401);
  });

  it('should return 401 when not sending token via x-access-token', async () => {
    const { token, boxId } = await createDelivery();
    const validBody = {
      boxId,
      feedbackId: faker.random.arrayElement(['1', '2']),
      comment: '',
    };
    const result = await request.post('/feedback').set('authorization', token);
    expect(result.status).toEqual(401);
  });

  it('should return 400 when not sending body', async () => {
    const { token, boxId } = await createDelivery();
    const result = await request.post('/feedback').set('x-access-token', token);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty body', async () => {
    const { token, boxId } = await createDelivery();
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send({});
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending boxId', async () => {
    const { boxId, token } = await createDelivery();
    const invalidBody = {
      feedbackId: faker.random.arrayElement(['1', '2']),
      comment: '',
    };
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending feedbackId', async () => {
    const { boxId, token } = await createDelivery();
    const invalidBody = {
      boxId,
      comment: '',
    };
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending valid feedbackId', async () => {
    const { boxId, token } = await createDelivery();
    const invalidBody = {
      boxId,
      feedbackId: faker.random.arrayElement(['3', '5', 'oi', 10]),
      comment: '',
    };
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending comment with feedbackId 1', async () => {
    const { boxId, token } = await createDelivery();
    const invalidBody = {
      boxId,
      feedbackId: 1,
      comment: faker.datatype.string(),
    };
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 200 when sending comment with feedbackId 2', async () => {
    const { boxId, token } = await createDelivery();
    const validBody = {
      boxId,
      feedbackId: 2,
      comment: faker.datatype.string(),
    };
    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(validBody);
    expect(result.status).toEqual(200);
  });

  it('should return 200 when not sending comment with feedbackId 1', async () => {
    const { boxId, token } = await createDelivery();
    const validBody = {
      boxId,
      feedbackId: 1,
    };

    const result = await request
      .post('/feedback')
      .set('x-access-token', token)
      .send(validBody);
    expect(result.status).toEqual(200);
  });
});
