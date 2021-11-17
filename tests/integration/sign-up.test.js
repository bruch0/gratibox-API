import '../../src/setup.js';
import supertest from 'supertest';
import fakerbr from 'faker-br';
import app from '../../src/app.js';
import clearUsers from '../utils/clearUsers.js';

afterAll(clearUsers);

const request = supertest(app);

describe('post sign-up', () => {
  it('should return 400 when not sending body', async () => {
    const result = await request.post('/sign-up');
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty body', async () => {
    const emptyBody = {};
    const result = await request.post('/sign-up').send(emptyBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending name', async () => {
    const invalidBody = {
      email: fakerbr.internet.email(),
      password: fakerbr.internet.password(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty name', async () => {
    const invalidBody = {
      name: '',
      email: fakerbr.internet.email(),
      password: fakerbr.internet.password(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending email', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      password: fakerbr.internet.password(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty email', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: '',
      password: fakerbr.internet.password(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when not sending password', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: fakerbr.internet.email(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending empty password', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: fakerbr.internet.email(),
      password: '',
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending invalid email', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: fakerbr.name.findName(),
      password: fakerbr.internet.password(),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 400 when sending invalid password', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: fakerbr.internet.email(),
      password: fakerbr.internet.password(7),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(400);
  });

  it('should return 201 when sending validBody', async () => {
    const invalidBody = {
      name: fakerbr.name.findName(),
      email: fakerbr.internet.email(),
      password: fakerbr.internet.password(8),
    };
    const result = await request.post('/sign-up').send(invalidBody);
    expect(result.status).toEqual(201);
  });
});

fakerbr.name.findName();
