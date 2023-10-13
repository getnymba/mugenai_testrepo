/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
// const link_forgot_password = '.v-form > .v-row > :nth-child(5) > .d-flex > .text-caption:nth-child(1)';
const link_forgot_password = '.v-form > .v-row > :nth-child(5) > a';
const forgot_password_submit = '.v-form > .v-row > :nth-child(4) > .v-btn';
const forgot_password_input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const forgot_password_input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const verification_code_dummy = Cypress.env('verification_code_dummy');
const wait_millisecond = 1000 * 60 * 5; // 5 minutes

beforeEach(() => {
  cy.visit(base_url);
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(1)').click();
  cy.get(link_forgot_password).click();
  cy.url().should('eq', `${base_url}/auth/forgot-password`);
  const forgot_password_title = ".v-form > .v-row > :nth-child(2) > .text-subtitle-1";
  cy.get(forgot_password_title).should('have.text', 'Reset Password');
  cy.get(forgot_password_input_email).type(current_email);
  cy.wait(wait_millisecond);
  cy.get(forgot_password_submit).click();
  cy.get(forgot_password_input_email_message).should('not.exist');
  cy.url().should('eq', `${base_url}/auth/password-reset`);
  const page_title = ".v-form > .v-row > :nth-child(2) > .text-subtitle-1";
  cy.get(page_title).should('have.text', 'Reset Password');
})

// R1:
// 8 or more characters
// At least one uppercase letter, one lowercase letter, one number, and one symbol
// (no spaces allowed)
// 8 characters or more
// Uppercase, lowercase letters, numbers, symbols, at least one character
// (no spaces allowed)
it("R1", () => {
  const password_condition1 = ".v-form > .v-row > :nth-child(3) > :nth-child(1) > div";
  cy.get(password_condition1).should('have.text', '8 characters or more');

  const password_condition2 = ".v-form > .v-row > :nth-child(3) > :nth-child(2) > div";
  cy.get(password_condition2).should('have.text', 'Uppercase, lowercase letter, numbers, symbol, at least one character(no spaces allowed)');
});

it("R2", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).type(current_password);

  const submit_btn = ".v-form > .v-row > :nth-child(8) button";
  cy.get(submit_btn).click();

  const alert = ".v-card > .v-alert > .v-alert__content";
  cy.get(alert).should('contain.text', "Verification code is incorrect. Please check and try again.");
});

it("R3", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(verification_field).clear();

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_confirm_field).type(current_password);

  const submit_btn = ".v-form > .v-row > :nth-child(8) button";
  cy.get(submit_btn).click();

  const verification_field_message = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(verification_field_message).should("contain.text", "This field is required");
});


it("R4", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_field).type('KUBa');

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_confirm_field).type('KUBa');

  const submit_btn = ".v-form > .v-row > :nth-child(8) button";
  cy.get(submit_btn).click();

  const password_condition1 = ".v-form > .v-row > :nth-child(3) > :nth-child(1) > div > span";
  cy.get(password_condition1).should('not.have.class', 'text-green');

  const password_condition2 = ".v-form > .v-row > :nth-child(3) > :nth-child(2) > div > span";
  cy.get(password_condition2).should($spans => {
    expect($spans).to.have.length(6);
    let greens = $spans.filter($span => {
      return $spans[$span].className.includes("text-green");
    }).length;
    expect(greens).to.be.lessThan(6);
  });

  cy.get(password_field).type(current_password);

  cy.get(password_condition1).should('have.class', 'text-green');

  cy.get(password_condition2).should($spans => {
    expect($spans).to.have.length(6);
    let greens = $spans.filter($span => {
      return $spans[$span].className.includes("text-green");
    }).length;
    expect(greens).to.be.equal(6);
  });
});


it("R5", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_field).clear();

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_confirm_field).clear();

  const submit_btn = ".v-form > .v-row > :nth-child(8) button";
  cy.get(submit_btn).click();

  const password_message = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_message).should("contain.text", "This field is required");

  const password_confirm_message = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_confirm_message).should("contain.text", "This field is required");
});

it("R6", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
  cy.get(password_confirm_field).type(current_password + 'qJsu');

  const submit_btn = ".v-form > .v-row > :nth-child(8) button";
  cy.get(submit_btn).click();

  const password_confirm_message = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_confirm_message).should("contain.text", "Passwords do not match");
});
