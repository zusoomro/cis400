/// <reference types="cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006/");
  });

  describe("My first test", () => {
    it("Does not do much", () => {
      expect(true).to.equal(true);
    });
  });

  describe("The login page", () => {
    it("Allows you to input your information", () => {
      cy.get("input[placeholder=email]")
        .click()
        .type("zusoomro@seas.upenn.edu");
      cy.get("input[placeholder=password]").click().type("password");
      cy.contains("Login").click();
    });
  });
});
