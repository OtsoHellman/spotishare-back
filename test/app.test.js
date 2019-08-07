const request = require('supertest');

const app = require('../src/app');

describe('app', () => {
  it('responds with not authorized',(done) => {
    request(app)
      .get('/')
      .expect(400, done);
  });
});
