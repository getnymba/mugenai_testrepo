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
const current_email = Cypress.env('email_manager');
const current_password = Cypress.env('password_manager');
const email_dummy = Cypress.env('email_dummy');
const password_dummy = Cypress.env('password_dummy');
const email_incorrect_format = Cypress.env('email_incorrect_format');

beforeEach(() => {
  cy.visit(base_url);
})

it("should display a field for entering email address and password - L1, L2", () => {
  cy.get(input_email).should('have.attr', 'type', 'text');
  cy.get(input_password).should('have.attr', 'type', 'password');
});

it("should allow login with register email address and password - L3, L4", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.url().should('eq', `${base_url}/`);
});

it("should not allow access without entering password and email address - L5, L6", () => {
  cy.get(btn_login).click();
  cy.get(input_email_message).should('exist');
  cy.get(input_email_message).should('have.text', 'この項目は必須です');
  cy.get(input_password_message).should('exist');
  cy.get(input_password_message).should('have.text', 'この項目は必須です');
});

it("should display an error message: 'This field is required' when email address is not right, password is not right entered  - L7, L8", () => {
  cy.get(input_email).type(email_dummy);
  cy.get(input_password).type(password_dummy);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("should display an error message: 'This field is required' when email address correct but, password is not right - L9, L10", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(password_dummy);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("should display an error message: 'This field is required' when email address is not right but, password is right - L11, L12", () => {
  cy.get(input_email).type(email_dummy);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("shows when  email address format is incorrect - L13", () => {
  cy.get(input_email).type(email_incorrect_format);
  cy.get(btn_login).click();
  cy.get(input_email_message).should('exist');
  cy.get(input_email_message).should('have.text', 'メールアドレスの形式が正しくありません');
});

it("should allow login by clicking - L14", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.url().should('eq', `${base_url}/`);
});

it("should transition to the email input screen when the 'Forgot Password' button is clicked. After entering the email, it sends an authentication code to the email and transitions to the password reset screen It should display an error message when no email is entered. It should display an error message when the entered email format is incorrect - L15", () => {
  cy.get(link_forgot_password).click();
  cy.url().should('eq', `${base_url}/auth/forgot-password`);
  cy.get(forgot_password_submit).click();
  cy.get('.v-alert__content').should('have.text', 'エラーが発生しました。');
  cy.get(forgot_password_input_email).type(email_incorrect_format);
  cy.get(forgot_password_input_email_message).should('exist');
  cy.get(forgot_password_input_email_message).should('have.text', 'メールアドレスの形式が正しくありません');
  cy.get(forgot_password_input_email).clear();
  cy.get(forgot_password_submit).click();
  cy.get(forgot_password_input_email_message).should('exist');
  cy.get(forgot_password_input_email_message).should('have.text', 'この項目は必須です');
  cy.get(forgot_password_input_email).clear();
  cy.get(forgot_password_input_email).type(current_email);
  cy.get(forgot_password_input_email_message).should('not.exist');
  cy.get(forgot_password_submit).click();
  cy.url().should('eq', `${base_url}/auth/password-reset`);
});

// L16 - By clicking on the language switch, you can choose between two options, Japanese and English.
it("should allow selection from two options, Japanese and English, when the language switch is clicked - L16", () => {
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(1)').click();
  cy.get(':nth-child(6) > .v-btn').should('have.text', 'Login');
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(2)').click();
  cy.get('.text-subtitle-1').should('have.text', 'ログイン');
});

// L17 - Show or hide password
it("should allow the password to be shown or hidden - L17", () => {
  cy.get(input_password).type("password");
  cy.get(input_password).should('have.attr', 'type', 'password');
  cy.get('.v-field__append-inner > .material-icons').click();
  cy.get(input_password).should('have.attr', 'type', 'text');
  cy.get('.v-field__append-inner > .material-icons').click();
  cy.get(input_password).should('have.attr', 'type', 'password');
});
