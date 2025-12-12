import LoginPage from "../../pageObjects/LoginPage";

describe("OrangeHRM - Login Feature", () => {

  let data;

  beforeEach(() => {
    cy.fixture("loginData").then((x) => {
      data = x;
    });

    LoginPage.visit();
    LoginPage.usernameField().should("be.visible");
  });

  // ----------------------------
  // TC001 - Valid Login
  // ----------------------------
  it("TC001 - Login Success", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.inputPassword(data.validUser.password);
    LoginPage.clickLogin();

    cy.url().should("include", "/dashboard");
  });

  // ----------------------------
  // TC002 - Invalid Username
  // ----------------------------
  it("TC002 - Invalid Username", () => {
    LoginPage.inputUsername(data.invalidUser.username);
    LoginPage.inputPassword(data.validUser.password);
    LoginPage.clickLogin();

    LoginPage.assertError("Invalid credentials");
  });

  // ----------------------------
  // TC003 - Invalid Password
  // ----------------------------
  it("TC003 - Invalid Password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.inputPassword(data.invalidUser.password);
    LoginPage.clickLogin();

    LoginPage.assertError("Invalid credentials");
  });

  // ----------------------------
  // TC004 - Empty Username
  // ----------------------------
  it("TC004 - Empty Username", () => {
    LoginPage.inputPassword(data.validUser.password);
    LoginPage.clickLogin();

    LoginPage.assertError("Required");
  });

  // ----------------------------
  // TC005 - Empty Password
  // ----------------------------
  it("TC005 - Empty Password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.clickLogin();

    LoginPage.assertError("Required");
  });

  // ----------------------------
  // TC006 - Empty Both
  // ----------------------------
  it("TC006 - Empty Both", () => {
    LoginPage.clickLogin();
    LoginPage.assertError("Required");
  });

  // ----------------------------
  // TC007 - Should reject symbol
  // ----------------------------
  it("TC007 - Username cannot contain symbols", () => {
    LoginPage.inputUsername(data.symbolsUsername);
    LoginPage.usernameField().invoke("val").then(val => {
      LoginPage.assertNoSymbols(val);
    });
  });

  // ----------------------------
  // TC008 - Reject Emoji / Non ASCII
  // ----------------------------
  it("TC008 - Username cannot contain emoji / unicode", () => {
    LoginPage.inputUsername(data.emojiUsername);
    LoginPage.usernameField().invoke("val").then(val => {
      LoginPage.assertNoEmoji(val);
    });
  });

  // ----------------------------
  // TC009 - No Spaces Allowed
  // ----------------------------
  it("TC009 - Username cannot contain spaces", () => {
    LoginPage.inputUsername(data.spacedUsername);
    LoginPage.usernameField().invoke("val").then(val => {
      LoginPage.assertNoSpaces(val);
    });
  });

  // ----------------------------
  // TC010 - Max Length
  // ----------------------------
  it("TC010 - Max 200 chars", () => {
    const longInput = data.longUsername.repeat(3);

    LoginPage.inputUsername(longInput);
    LoginPage.usernameField().invoke("val").then(val => {
      LoginPage.assertMaxLength(val, 200);
    });
  });

});
