import type { Express } from 'express';
import request from 'supertest';

import { createApp } from '~/app';

describe('App', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it('should respond to /health with status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    // check headers
    expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate');
    expect(response.headers['pragma']).toBe('no-cache');
    expect(response.headers['expires']).toBe('0');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  it('should return 500 for unhandled errors', async () => {
    // Create a route that throws an error to test the error handler
    app.get('/error', () => {
      throw new Error('Test error');
    });

    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
  });
});