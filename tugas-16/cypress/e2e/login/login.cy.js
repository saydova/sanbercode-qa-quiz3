describe("OrangeHRM - Login Feature", () => {

  let loginData;

  beforeEach(() => {
    cy.visit("/web/index.php/auth/login");
    cy.get("input[name='username']", { timeout: 10000 }).should("be.visible");

    cy.fixture("loginData").then((data) => {
      loginData = data;
    });
  });

  // -------------------------------------------------------
  // TC001 - Login Success
  // -------------------------------------------------------
  it("TC001 - Login Success with valid credential", () => {
    cy.intercept("POST", "**/auth/validate").as("loginSuccess");

    cy.inputUsername(loginData.validUser.username);
    cy.inputPassword(loginData.validUser.password);
    cy.clickLogin();

    cy.wait("@loginSuccess");
    cy.url().should("include", "/dashboard");
  });

  // -------------------------------------------------------
  // TC002 - Invalid username
  // -------------------------------------------------------
  it("TC002 - Login Failed with invalid username", () => {
    cy.intercept("POST", "**/auth/validate").as("invalidUser");

    cy.inputUsername(loginData.invalidUser.username);
    cy.inputPassword(loginData.validUser.password);
    cy.clickLogin();

    cy.wait("@invalidUser");
    cy.contains("Invalid credentials").should("be.visible");
  });

  // -------------------------------------------------------
  // TC003 - Invalid password
  // -------------------------------------------------------
  it("TC003 - Login Failed with invalid password", () => {
    cy.intercept("POST", "**/auth/validate").as("invalidPass");

    cy.inputUsername(loginData.validUser.username);
    cy.inputPassword(loginData.invalidUser.password);
    cy.clickLogin();

    cy.wait("@invalidPass");
    cy.contains("Invalid credentials").should("be.visible");
  });

  // -------------------------------------------------------
  // TC004 - Empty username
  // -------------------------------------------------------
  it("TC004 - Login Failed with empty username", () => {
    cy.intercept("POST", "**/auth/validate").as("emptyUser");

    cy.inputPassword(loginData.validUser.password);
    cy.clickLogin();

    cy.wait("@emptyUser");
    cy.contains("Required").should("be.visible");
  });

  // -------------------------------------------------------
  // TC005 - Empty password
  // -------------------------------------------------------
  it("TC005 - Login Failed with empty password", () => {
    cy.intercept("POST", "**/auth/validate").as("emptyPass");

    cy.inputUsername(loginData.validUser.username);
    cy.clickLogin();

    cy.wait("@emptyPass");

    cy.contains("Required").should("be.visible");
  });

  // -------------------------------------------------------
  // TC006 - Both empty
  // -------------------------------------------------------
  it("TC006 - Login Failed with both fields empty", () => {
    cy.intercept("POST", "**/auth/validate").as("emptyBoth");

    cy.clickLogin();
    cy.wait("@emptyBoth");

    cy.contains("Required").should("be.visible");
  });

  // -------------------------------------------------------
  // TC007 - Symbol validation
  // -------------------------------------------------------
  it("TC007 - Username must not accept symbol characters (validate on input/blur)", () => {
    cy.intercept("GET", "**/validate/symbol-check").as("validateSymbols");

    const symbolRegex = /[!@#$%^&*(),.?":{}|<>\\\/';=\-\:\)\(\_]/;

    cy.get("input[name='username']")
      .clear()
      .type(loginData.symbolsUsername)
      .blur();

    cy.wait("@validateSymbols");

    cy.wait(200);
    cy.get("input[name='username']").invoke("val").then(val => {
      if (!symbolRegex.test(val)) {
        expect(symbolRegex.test(val)).to.be.false;
        return;
      }

      cy.get("body").then($body => {
        const inline = $body.find("div[role='alert'], .oxd-input-field-error, .error, .help-block, .validation-error");
        if (inline.length) {
          cy.wrap(inline).should("be.visible");
          return;
        }

        throw new Error("TC007 failed: username allowed symbol characters and no inline validation.");
      });
    });
  });

  // -------------------------------------------------------
  // TC008 - Emoji / Non ASCII
  // -------------------------------------------------------
  it("TC008 - Username must not accept emoticons / non-ascii characters", () => {
    cy.intercept("GET", "**/validate/emoji-check").as("validateEmoji");

    const nonAsciiRegex = /[^\x00-\x7F]/;

    cy.get("input[name='username']")
      .clear()
      .type(loginData.emojiUsername)
      .blur();

    cy.wait("@validateEmoji");

    cy.wait(200);
    cy.get("input[name='username']").invoke("val").then(val => {
      if (!nonAsciiRegex.test(val)) {
        expect(nonAsciiRegex.test(val)).to.be.false;
        return;
      }

      cy.get("body").then($body => {
        const inline = $body.find("div[role='alert'], .oxd-input-field-error, .error, .help-block, .validation-error");
        if (inline.length) {
          cy.wrap(inline).should("be.visible");
          return;
        }

        throw new Error("TC008 failed: username accepted emoticons and no inline validation.");
      });
    });
  });

  // -------------------------------------------------------
  // TC009 - Space validation
  // -------------------------------------------------------
  it("TC009 - Username must not contain spaces between characters", () => {
    cy.intercept("GET", "**/validate/space-check").as("validateSpaces");

    cy.get("input[name='username']")
      .clear()
      .type(loginData.spacedUsername)
      .blur();

    cy.wait("@validateSpaces");

    cy.wait(200);
    cy.get("input[name='username']").invoke("val").then(val => {
      if (!/\s/.test(val)) {
        expect(/\s/.test(val)).to.be.false;
        return;
      }

      cy.get("body").then($body => {
        const inline = $body.find("div[role='alert'], .oxd-input-field-error, .error, .help-block, .validation-error");
        if (inline.length) {
          cy.wrap(inline).should("be.visible");
          return;
        }

        throw new Error("TC009 failed: username contains spaces and no inline validation.");
      });
    });
  });

  // -------------------------------------------------------
  // TC010 - Max length
  // -------------------------------------------------------
  it("TC010 - Username must not exceed 200 characters", () => {
    cy.intercept("GET", "**/validate/length-check").as("validateLength");

    const longUsername = loginData.longUsername.repeat(3);

    cy.get("input[name='username']")
      .clear()
      .type(longUsername)
      .blur();

    cy.wait("@validateLength");

    cy.wait(200);
    cy.get("input[name='username']").then($input => {
      const maxlength = $input.attr("maxlength");

      if (maxlength) {
        expect(Number(maxlength)).to.be.at.most(200);
        cy.wrap($input).invoke("val").its("length").should("be.lte", Number(maxlength));
        return;
      }

      cy.wrap($input).invoke("val").then(val => {
        if (val.length <= 200) {
          expect(val.length).to.be.lte(200);
          return;
        }

        cy.get("body").then($body => {
          const inline = $body.find("div[role='alert'], .oxd-input-field-error, .error, .help-block, .validation-error");
          if (inline.length) {
            cy.wrap(inline).should("be.visible");
            return;
          }

          throw new Error("TC010 failed: username >200 chars accepted and no inline validation.");
        });
      });
    });
  });

});
