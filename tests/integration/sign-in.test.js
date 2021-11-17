import '../../src/setup.js';
import supertest from 'supertest';
import fakerbr from 'faker-br';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';
import createUser from '../factories/userFactory.js';

beforeAll(clearUsers);
afterAll(clearUsers);

const request = supertest(app);

describe('post sign-in', () => {
  it('should return 400 when not sending body', async () => {
    const result = await request.post('/sign-in');
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty body', async () => {
    const result = await request.post('/sign-in').send({});
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending email', async () => {
    const user = await createUser();
    const result = await request
      .post('/sign-in')
      .send({ password: user.password });
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending password', async () => {
    const user = await createUser();
    const result = await request.post('/sign-in').send({ email: user.email });
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty password', async () => {
    const user = await createUser();
    const result = await request
      .post('/sign-in')
      .send({ email: user.email, password: '' });
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty email', async () => {
    const user = await createUser();
    const result = await request
      .post('/sign-in')
      .send({ email: '', password: user.password });
    expect(result.status).toEqual(400);
  });

  it('should return 401 when the password is incorrect', async () => {
    const user = await createUser();
    const result = await request
      .post('/sign-in')
      .send({ email: user.email, password: fakerbr.internet.password() });
    expect(result.status).toEqual(401);
  });

  it('should return 200 when the user is correct', async () => {
    const user = await createUser();
    const result = await request.post('/sign-in').send(user);
    expect(result.status).toEqual(200);
  });
});
