/// <reference types="cypress" />

describe('Reqres API Automation with Intercept + Fixture Data', () => {

    let userData;
  
    before(() => {
      cy.fixture('userData.json').then((data) => {
        userData = data;
      });
    });
  
    it('POST /users - create user', () => {
      cy.intercept('POST', 'https://reqres.in/api/users', { statusCode: 201, body: { id: '101', createdAt: '2025-12-12T00:00:00.000Z' } }).as('createUser');
  
      cy.request('POST', 'https://reqres.in/api/users', userData.createUser)
        .then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('id');
        });
    });
  
    it('PUT /users/1 - update user', () => {
      cy.intercept('PUT', 'https://reqres.in/api/users/1', { statusCode: 200, body: { updatedAt: '2025-12-12T00:00:00.000Z' } }).as('updateUser');
  
      cy.request('PUT', 'https://reqres.in/api/users/1', userData.updateUser)
        .then((res) => {
          expect(res.status).to.eq(200);
        });
    });
  
    it('PATCH /users/1 - patch user', () => {
      cy.intercept('PATCH', 'https://reqres.in/api/users/1', { statusCode: 200, body: { updatedAt: '2025-12-12T00:00:00.000Z' } }).as('patchUser');
  
      cy.request('PATCH', 'https://reqres.in/api/users/1', userData.patchUser)
        .then((res) => {
          expect(res.status).to.eq(200);
        });
    });
  
    it('POST /register - success', () => {
      cy.intercept('POST', 'https://reqres.in/api/register', { statusCode: 200, body: { id: 4, token: 'QpwL5tke4Pnpja7X4' } }).as('register');
  
      cy.request('POST', 'https://reqres.in/api/register', userData.registerUser)
        .then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.token).to.exist;
        });
    });
  
    it('POST /register - missing password', () => {
      cy.intercept('POST', 'https://reqres.in/api/register', { statusCode: 400, body: { error: 'Missing password' } }).as('registerNoPass');
  
      cy.request({ method: 'POST', url: 'https://reqres.in/api/register', body: userData.registerUserNoPass, failOnStatusCode: false })
        .then((res) => {
          expect(res.status).to.eq(400);
          expect(res.body.error).to.eq('Missing password');
        });
    });
  
    it('POST /login - success', () => {
      cy.intercept('POST', 'https://reqres.in/api/login', { statusCode: 200, body: { token: 'QpwL5tke4Pnpja7X4' } }).as('login');
  
      cy.request('POST', 'https://reqres.in/api/login', userData.loginUser)
        .then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.token).to.exist;
        });
    });
  
    it('POST /login - missing password', () => {
      cy.intercept('POST', 'https://reqres.in/api/login', { statusCode: 400, body: { error: 'Missing password' } }).as('loginNoPass');
  
      cy.request({ method: 'POST', url: 'https://reqres.in/api/login', body: userData.loginUserNoPass, failOnStatusCode: false })
        .then((res) => {
          expect(res.status).to.eq(400);
          expect(res.body.error).to.eq('Missing password');
        });
    });
  
  });
  