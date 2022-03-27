/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Kinetics Auth", () => {
  it("successfully loads, login and renders application", () => {
    const username = Cypress.env("TEST_USERNAME");
    const password = Cypress.env("TEST_PASSWORD");

    cy.visit("http://localhost:3000");
    cy.contains("Sign in to your account");
    cy.get("input[name=email]").type(username);
    cy.get("input[name=password]").type(password);
    cy.get("form").submit();
    cy.get("div").contains(/^Token: ey/); // base64 encoded token
  });
});
