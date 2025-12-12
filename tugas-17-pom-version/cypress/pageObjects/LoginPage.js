class LoginPage {
    usernameLocator = "input[name='username']";
    passwordLocator = "input[name='password']";
    loginButton = "button[type='submit']";
    errorInline = "div[role='alert'], .oxd-input-field-error, .error";
  
    visit() {
      cy.visit("/web/index.php/auth/login");
    }
  
    usernameField() {
      return cy.get(this.usernameLocator);
    }
  
    inputUsername(value) {
      this.usernameField().clear().type(value);
    }
  
    inputPassword(value) {
      cy.get(this.passwordLocator).clear().type(value);
    }
  
    clickLogin() {
      cy.get(this.loginButton).click();
    }
  
    assertError(text) {
      cy.contains(text).should("be.visible");
    }
  
    assertInlineError() {
      cy.get("body").find(this.errorInline).should("be.visible");
    }
  
    assertNoSymbols(value) {
      const symbolRegex = /[!@#$%^&*(),.?":{}|<>\\\/';=\-\:\)\(\_]/;
      expect(symbolRegex.test(value)).to.be.false;
    }
  
    assertNoEmoji(value) {
      const nonAscii = /[^\x00-\x7F]/;
      expect(nonAscii.test(value)).to.be.false;
    }
  
    assertNoSpaces(value) {
      expect(/\s/.test(value)).to.be.false;
    }
  
    assertMaxLength(value, max = 200) {
      expect(value.length).to.be.lte(max);
    }
  }
  
  export default new LoginPage();
  