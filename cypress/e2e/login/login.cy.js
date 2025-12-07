describe("OrangeHRM - Login Feature", () => {

    let loginData;
  
    beforeEach(() => {
      cy.visit("/web/index.php/auth/login");
      cy.get("input[name='username']", { timeout: 10000 }).should("be.visible");
  
      cy.fixture("loginData").then((data) => {
        loginData = data;
      });
    });
  
    it("TC001 - Login Success with valid credential", () => {
      cy.inputUsername(loginData.validUser.username);
      cy.inputPassword(loginData.validUser.password);
      cy.clickLogin();
      cy.url().should("include", "/dashboard");
    });
  
    it("TC002 - Login Failed with invalid username", () => {
      cy.inputUsername(loginData.invalidUser.username);
      cy.inputPassword(loginData.validUser.password);
      cy.clickLogin();
      cy.contains("Invalid credentials").should("be.visible");
    });
  
    it("TC003 - Login Failed with invalid password", () => {
      cy.inputUsername(loginData.validUser.username);
      cy.inputPassword(loginData.invalidUser.password);
      cy.clickLogin();
      cy.contains("Invalid credentials").should("be.visible");
    });
  
    it("TC004 - Login Failed with empty username", () => {
      cy.inputPassword(loginData.validUser.password);
      cy.clickLogin();
  
      cy.get("body").then($body => {
        if ($body.find("div[role='alert'], .oxd-input-field-error, .error").length) {
          cy.get("div[role='alert'], .oxd-input-field-error, .error").should("be.visible");
        } else {
          cy.contains("Required").should("be.visible");
        }
      });
    });
  
    it("TC005 - Login Failed with empty password", () => {
      cy.inputUsername(loginData.validUser.username);
      cy.clickLogin();
  
      cy.get("body").then($body => {
        if ($body.find("div[role='alert'], .oxd-input-field-error, .error").length) {
          cy.get("div[role='alert'], .oxd-input-field-error, .error").should("be.visible");
        } else {
          cy.contains("Required").should("be.visible");
        }
      });
    });
  
    it("TC006 - Login Failed with both fields empty", () => {
      cy.clickLogin();
  
      cy.get("body").then($body => {
        if ($body.find("div[role='alert'], .oxd-input-field-error, .error").length) {
          cy.get("div[role='alert'], .oxd-input-field-error, .error").should("be.visible");
        } else {
          cy.contains("Required").should("be.visible");
        }
      });
    });
  
    // -------------------------
    // Validation-focused tests
    // -------------------------
  
    it("TC007 - Username must not accept symbol characters (validate on input/blur)", () => {
      const symbolRegex = /[!@#$%^&*(),.?":{}|<>\\\/';=\-\:\)\(\_]/;
  
      cy.get("input[name='username']")
        .clear()
        .type(loginData.symbolsUsername)
        .blur();
  
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
  
    it("TC008 - Username must not accept emoticons / non-ascii characters (validate on input/blur)", () => {
      const nonAsciiRegex = /[^\x00-\x7F]/;
  
      cy.get("input[name='username']")
        .clear()
        .type(loginData.emojiUsername)
        .blur();
  
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
  
    it("TC009 - Username must not contain spaces between characters (validate on input/blur)", () => {
      cy.get("input[name='username']")
        .clear()
        .type(loginData.spacedUsername)
        .blur();
  
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
  
    it("TC010 - Username must not exceed 200 characters (validate on input/blur)", () => {
      const longUsername = loginData.longUsername.repeat(3);
  
      cy.get("input[name='username']")
        .clear()
        .type(longUsername)
        .blur();
  
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
  