// cypress/support/commands.js

Cypress.Commands.add("inputUsername", (username) => {
    cy.get("input[name='username']").clear().type(username);
  });
  
  Cypress.Commands.add("inputPassword", (password) => {
    cy.get("input[name='password']").clear().type(password);
  });
  
  Cypress.Commands.add("clickLogin", () => {
    cy.get("button[type='submit']").click();
  });
  