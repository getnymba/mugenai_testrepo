/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const link_forgot_password = '.v-form > .v-row > :nth-child(5) > .text-caption';
const forgot_password_submit = '.v-form > .v-row > :nth-child(5) > .v-btn';
const forgot_password_input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const forgot_password_input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_user');
const current_password = Cypress.env('password_user');
const verification_code_dummy = Cypress.env('verification_code_dummy');
const wait_millisecond = 1000 * 60 * 5; // 5 minutes

beforeEach(() => {
  cy.visit(base_url);
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(1)').click();
  cy.get(link_forgot_password).click();
  cy.url().should('eq', `${base_url}/auth/forgot-password`);
  const forgot_password_title = ".v-form > .v-row > :nth-child(2) > .text-subtitle-1";
  cy.get(forgot_password_title).should('have.text', 'Forgot Password?');
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
it("should set password condition - R1", () => {
  const password_condition1 = ".v-form > .v-row > :nth-child(3) > :nth-child(1) > div";
  cy.get(password_condition1).should('have.text', '8 characters or more');

  const password_condition2 = ".v-form > .v-row > :nth-child(3) > :nth-child(2) > div";
  cy.get(password_condition2).should('have.text', 'Uppercase, lowercase letter, numbers, symbol, at least one character(no spaces allowed)');
});

it("should allow entering the verification code received via email. It should display an error message: 'Verification code is incorrect. Please check and try again.' when the entered verification code is incorrect - R2", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).type(current_password);

  const submit_btn = ".v-form > .v-row > :nth-child(9) button";
  cy.get(submit_btn).click();

  const alert = ".v-card > .v-alert > .v-alert__content";
  cy.get(alert).should('contain.text', "Verification code is incorrect. Please check and try again.");
});

it("should display an error message: 'This field is required' when no verification code is entered - R3", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).clear();

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).type(current_password);

  const submit_btn = ".v-form > .v-row > :nth-child(9) button";
  cy.get(submit_btn).click();

  const verification_field_message = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(verification_field_message).should("contain.text", "This field is required");
});


it("should display an error message: 'Please set a password of at least 8 characters, including uppercase and lowercase alphabetic letters, numbers, and symbols.' when the new password does not meet the set conditions - R4", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).type('KUBa');

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).type('KUBa');

  const submit_btn = ".v-form > .v-row > :nth-child(9) button";
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


it("should display an error message: 'This field is required' when no new password is entered - R5", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).clear();

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).clear();

  const submit_btn = ".v-form > .v-row > :nth-child(9) button";
  cy.get(submit_btn).click();

  const password_message = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_message).should("contain.text", "This field is required");

  const password_confirm_message = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_confirm_message).should("contain.text", "This field is required");
});

it("should display an error message: 'Password does not match.' when the new passwords do not match - R6", () => {
  const verification_field = ".v-form > .v-row > :nth-child(5) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(verification_field).type(verification_code_dummy);

  const password_field = ".v-form > .v-row > :nth-child(6) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_field).type(current_password);

  const password_confirm_field = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
  cy.get(password_confirm_field).type(current_password + 'qJsu');

  const submit_btn = ".v-form > .v-row > :nth-child(9) button";
  cy.get(submit_btn).click();

  const password_confirm_message = ".v-form > .v-row > :nth-child(7) > .v-input > .v-input__details > .v-messages > .v-messages__message";
  cy.get(password_confirm_message).should("contain.text", "Passwords do not match");
});
