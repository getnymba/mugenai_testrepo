/// <reference types="cypress" />

const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = '.v-form >.v-row > :nth-last-child(1).v-col button';
const input_name_message = '.v-container > .v-form > .v-row > :nth-child(1) > .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_description_message = '.v-form > .v-row > :nth-child(2)> .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const user_icon_button = '.v-toolbar__content > .v-container > button'
// const delete_btn = '.v-overlay-container > .v-overlay >  .v-overlay__content > .v-card > .v-container > .v-row > :nth-child(2) > button'
const username_input_msg = '.v-input__details > .v-messages > .v-messages__message'
const btn_project = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(2) > .text-subtitle-1";
const project_card = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6)";

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const get_test_div = ".v-row > .v-col";
const test_user_username = "cypress_test_" + Math.floor(Date.now() / 1000);
const test_user_email = "test_" + Math.floor(Date.now() / 1000) + "@gmail.com";

function arrayEquals(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

const login = () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).type(current_email);
  cy.get(input_password).type(current_password);
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');

  cy.wait(4000);
};

const logout = () => {
  cy.visit(base_url);
  cy.wait(3000);
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });
  // cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);
};

beforeEach(() => {
  login();
});

afterEach(() => {
  logout();
});

it("U1 - ADMIN", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);

  cy.get('.v-container  > .v-row > :nth-child(1) > :nth-child(3)').click();
  cy.get('.v-container > .v-form > .v-row > :nth-last-child(1) > button').click();
  cy.get(username_input_msg).contains('This field is required').should('exist');
  cy.get('.v-container > .v-form > .v-row > .v-col:nth-child(1) > .v-input > .v-input__control > .v-field > .v-field__field').click({ force: true });
  cy.wait(500);
  cy.get('.v-select__content > .v-list > .v-list-item:nth-child(5)').click();
  // cy.get('.v-container > .v-form > .v-row > .v-col:nth-child(1) > .v-input > .v-input__control > .v-field > .v-field__append-inner > .material-icons').click();

  // cy.get('.v-container > .v-form > .v-row > .v-col:nth-child(1) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > .v-select__selection ').select(4);

  cy.get('input[placeholder*="Username"]').type(test_user_username, { force: true });
  cy.get('input[placeholder*="Email"]').type(test_user_email);
  cy.get(':nth-child(4) > .v-input > .v-input__control > .v-field').click({ force: true });
  cy.get(':nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__append-inner > .material-icons').click()
  cy.get('.v-row > :nth-child(5) > .v-btn').should('have.text', 'Create').click({ force: true });
  cy.get('.v-card > .v-container').should('not.exist')
  cy.get('tbody > :nth-child(1) > :nth-child(3)').should('have.text', test_user_email);
});

it("U2 - ADMIN", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);
  cy.get('input[placeholder*="Search User"]').type(test_user_email);
  cy.get('tbody > tr > :nth-child(3)').should('have.text', test_user_email);
  cy.get('input[placeholder*="Search User"]').clear();
  cy.get('input[placeholder*="Search User"]').type(test_user_username);
  cy.get('tbody > :nth-child(1) > :nth-child(2)').should("have.text", test_user_username);
  cy.get('input[placeholder*="Search User"]').clear();
  cy.get('input[placeholder*="Search User"]').type("Users");
  cy.get('tbody > :nth-child(1) > :nth-child(4)').should("have.text", "Users")
});

it("U6 - ADMIN", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);
  cy.get('input[placeholder*="Search User"]').type(test_user_username);
  cy.wait(2000)
  cy.get('tbody > :nth-child(1) > :nth-child(2)').should("have.text", test_user_username);
  cy.get(':nth-last-child(1) > .text-right > .bg-primary').click({ force: true });
  cy.get('input[placeholder*="Username"]').clear();
  cy.get('input[placeholder*="Username"]').type(test_user_username + "-edited");
  cy.get('.v-container > .v-form > .v-row > :nth-last-child(1) > button').click({ force: true })
  // cy.get('.v-row > :nth-child(4) > .v-btn').should('have.text', 'edit').click();
  cy.wait(4000)
  cy.get('input[placeholder*="Search User"]').clear();
  cy.get('input[placeholder*="Search User"]').type(test_user_username + "-edited");
  cy.get('tbody > tr > :nth-child(2)').should('have.text', test_user_username + "-edited");
});



it("U3.Sort by username, U4.Sort by email, U5.Sort by role", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(500);

  const btn_usermanagement_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
  cy.get(btn_usermanagement_container).click({ force: true });
  cy.wait(4000);

  let element_collector_username = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Username").click({ force: true });
  cy.wait(1000);
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_username.push($child[0].children[1].innerText);
    if ($list["length"] - 1 === index) {
      let element_collector_title_sorted = [...element_collector_username];
      element_collector_title_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      console.log("element_collector_username", element_collector_username);
      console.log("element_collector_title_sorted", element_collector_title_sorted);
      cy.expect(arrayEquals(element_collector_username, element_collector_title_sorted)).to.be.equal(true);

      let element_collector_title_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Username").click({ force: true });
      cy.wait(1000);
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_title_desc.push($child2[0].children[1].innerText);
        if ($list2["length"] - 1 === index2) {
          cy.log("element_collector_title_desc", element_collector_title_desc);
          let element_collector_title_desc_sorted = [...element_collector_title_desc];
          const allEqual = element_collector_title_desc_sorted.every(val => val === element_collector_title_desc_sorted[0]);
          element_collector_title_desc_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log("element_collector_title_desc_sorted:", element_collector_title_desc_sorted);
          cy.expect(arrayEquals(element_collector_title_desc, element_collector_title_desc_sorted)).to.be.equal(allEqual ? true : false);
          // cy.expect(arrayEquals(element_collector_title_desc, element_collector_title_desc_sorted)).to.be.equal(true);
        }
      });
    }
  });

  let element_collector_email = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Email").click({ force: true });
  cy.wait(1000);
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_email.push($child[0].children[2].innerText);
    if ($list["length"] - 1 === index) {
      let elements_sorted = [...element_collector_email];
      elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      console.log("element_collector_email", element_collector_email);
      console.log("elements_sorted:", elements_sorted);
      cy.expect(arrayEquals(element_collector_email, elements_sorted)).to.be.equal(true);

      let element_collector_body_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Email").click({ force: true });
      cy.wait(1000);
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_body_desc.push($child2[0].children[2].innerText);
        if ($list2["length"] - 1 === index2) {
          let elements_sorted = [...element_collector_body_desc];
          const allEqual = element_collector_body_desc.every(val => val === element_collector_body_desc[0]);
          elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log("element_collector_body_desc", element_collector_body_desc);
          console.log("elements_sorted:", elements_sorted);
          cy.expect(arrayEquals(element_collector_body_desc, elements_sorted)).to.be.equal(allEqual ? true : false);
        }
      });
    }
  });

  let element_collector_role = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Created At").click({ force: true });
  cy.wait(1000);
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_role.push($child[0].children[4].innerText);
    if ($list["length"] - 1 === index) {
      let elements_sorted = [...element_collector_role];
      elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      console.log("element_collector_role", element_collector_role);
      console.log("elements_sorted:", elements_sorted);
      cy.expect(arrayEquals(element_collector_role, elements_sorted)).to.be.equal(true);

      let element_collector_role_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Created At").click({ force: true });
      cy.wait(1000);
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_role_desc.push($child2[0].children[4].innerText);
        if ($list2["length"] - 1 === index2) {
          let elements_sorted = [...element_collector_role_desc];
          const allEqual = element_collector_role_desc.every(val => val === element_collector_role_desc[0]);
          elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log("element_collector_role_desc", element_collector_role_desc);
          console.log("elements_sorted:", elements_sorted);
          cy.expect(arrayEquals(element_collector_role_desc, elements_sorted)).to.be.equal(allEqual ? true : false);
        }
      });
    }
  });
});


// U7 ni data ustgah tul hamgiin suuld ajilluulna 
it("U7 - ADMIN", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(4000);
  cy.get('input[placeholder*="Search User"]').type(test_user_email);
  cy.get('tbody > tr > :nth-child(3)').should('have.text', test_user_email);
  cy.get(':nth-last-child(1) > .text-right > .bg-error').click({ force: true });
  cy.get(delete_btn).click();
  cy.wait(4000);
  cy.get('input[placeholder*="Search User"]').clear();
  cy.get('input[placeholder*="Search User"]').type(test_user_email);
  cy.get('td').should('have.text', 'No data available');
});