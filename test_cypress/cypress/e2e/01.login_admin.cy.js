/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const link_forgot_password = '.v-form > .v-row > :nth-child(5) > a';
const forgot_password_submit = '.v-form > .v-row > :nth-child(4) > .v-btn';
const forgot_password_input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const forgot_password_input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const email_dummy = Cypress.env('email_dummy');
const password_dummy = Cypress.env('password_dummy');
const email_incorrect_format = Cypress.env('email_incorrect_format');

beforeEach(() => {
  cy.visit(base_url);
})

it("L1, L2", () => {
  cy.get(input_email).should('have.attr', 'type', 'text');
  cy.get(input_password).should('have.attr', 'type', 'password');
});

it("L3, L4", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.url().should('eq', `${base_url}/`);
});

it("L5, L6", () => {
  cy.get(btn_login).click();
  cy.get(input_email_message).should('exist');
  cy.get(input_email_message).should('have.text', 'この項目は必須です');
  cy.get(input_password_message).should('exist');
  cy.get(input_password_message).should('have.text', 'この項目は必須です');
});

it("L7, L8", () => {
  cy.get(input_email).type(email_dummy);
  cy.get(input_password).type(password_dummy);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("L9, L10", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(password_dummy);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("L11, L12", () => {
  cy.get(input_email).type(email_dummy);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'メールアドレスまたはパスワードが間違っています。確認してもう一度入力してください。');
  cy.url().should('eq', `${base_url}/auth/login`);
});

it("L13", () => {
  cy.get(input_email).type(email_incorrect_format);
  cy.get(btn_login).click();
  cy.get(input_email_message).should('exist');
  cy.get(input_email_message).should('have.text', 'メールアドレスの形式が正しくありません');
});

it("L14", () => {
  cy.get(input_email).type(current_email);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click();
  cy.url().should('eq', `${base_url}/`);
});

it("L15", () => {
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
it("L16", () => {
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(1)').click();
  cy.get(':nth-child(6) > .v-btn').should('have.text', 'Login');
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click();
  cy.get('.v-list > :nth-child(2)').click();
  cy.get(':nth-child(6) > .v-btn').should('have.text', 'ログイン');
});

// L17 - Show or hide password
it("L17", () => {
  cy.get(input_password).type("password");
  cy.get(input_password).should('have.attr', 'type', 'password');
  cy.get('.v-field__append-inner > .material-icons').click();
  cy.get(input_password).should('have.attr', 'type', 'text');
  cy.get('.v-field__append-inner > .material-icons').click();
  cy.get(input_password).should('have.attr', 'type', 'password');
});
