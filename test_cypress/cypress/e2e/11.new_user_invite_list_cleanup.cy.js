import "cypress-file-upload";
/// <reference types="cypress" />

const input_email =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field input";
const input_password =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field input";
const input_email_message =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message input";
const input_password_message =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message input";
const btn_login = ".v-form > .v-row > :nth-child(6) > .v-btn";

const base_url = Cypress.env("host");
const current_email = Cypress.env('usinv_email_admin');
const current_password = Cypress.env('usinv_password_admin');

const group_list_title = "List of projects owned by me";
const test_project_name_suffix = "_NEW_USER_INVITE_LIST_ADMIN_AS_OWNER";
const test_project_name =
  "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const dummy_user_count = 13;
const dummy_user_timestamp = Math.floor(Date.now() / 1000);

Cypress.on("uncaught:exception", (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});

const login = () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem("onboarding", "false");
    },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get(".v-list > :nth-child(1)").click({ force: true });

  cy.get(input_email).type(current_email, { force: true });
  cy.get(input_password).type(current_password, { force: true });
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should("not.exist");
  cy.get(input_password_message).should("not.exist");
  cy.wait(6000);
  cy.url().should("eq", `${base_url}/`);

  cy.wait(4000);

  const guide_modal_btn_close =
    ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains("close").click({ force: true });

  const user_icon =
    ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should("have.text", "account_circle");
};

const logout = () => {
  const user_icon =
    ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should("have.text", "account_circle");
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container =
    ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);
};

const table_body =
  ".v-main > .v-container > .v-row > :nth-child(3).v-col > .v-table > .v-table__wrapper > table > tbody";
const recursiveDeletion = () => {
  let processed = false;
  cy.get(table_body)
    .children()
    .each(($child, index, $list) => {
      if (processed === true) return;
      if ($child[0].innerText.startsWith("testuser")) {
        cy.log("FOUND: " + $child[0].innerText);
        cy.wrap($child).should("contain.text", "testuser");
        // Deletion
        cy.wrap($child).contains("delete").click();
        cy.get(
          ".v-toolbar__content > .v-toolbar-title > .v-toolbar-title__placeholder"
        ).should("have.text", "Delete User");
        const selector_delete_btn =
          ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-row > :nth-child(2).v-col > button";
        cy.get(selector_delete_btn).click({ force: true });
        cy.wait(20000);
        recursiveDeletion();
        processed = true;
      }
    });
};

after(() => {
  // To delete all dummy guests

  const user_icon =
    ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should("have.text", "account_circle");
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_user_container =
    ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(3).v-list-item";
  cy.get(btn_user_container).click({ force: true });
  cy.wait(10000);

  const search_field =
    ".v-main > .v-container > .v-row > :nth-child(2).v-col > .v-input > .v-input__control > .v-field > .v-field__field input";
  cy.get(search_field).type("testuser", { force: true });

  recursiveDeletion();
});

before(() => {
  login();
});

it("should cleanup dummy users", () => {
  const container_project_list =
    ".v-container > :nth-child(2) > .v-row > .v-col";
  cy.get(container_project_list);
});
