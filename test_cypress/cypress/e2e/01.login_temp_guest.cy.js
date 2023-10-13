import 'cypress-file-upload';
/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const tempguest_input_password = ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const tempguest_input_password_message = ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const tempguest_btn_login = '.v-form > .v-row > :nth-child(3) > .v-btn';

const base_url = Cypress.env('host');
const temp_guest_url = Cypress.env('temp_guest_url');
const temp_guest_password = Cypress.env('temp_guest_password');
const password_dummy = Cypress.env('password_dummy');

const email_admin = Cypress.env('email_admin');
const password_admin = Cypress.env('password_admin');

const test_project_name = "Cypress test TEMP_GUEST";

const group_list_title_for_admin = "List of projects owned by me";

// Testiin ehend admin-aar nevterch orood test project uuseegui bval uusgeh zorilgotoi
const loginAdmin = () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({force: true});
  cy.get('.v-list > :nth-child(1)').click({force: true});

  cy.get(input_email).type(email_admin);
  cy.get(input_password).type(password_admin);
  cy.get(btn_login).click({force: true});

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({force: true});

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

const logout = () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({force: true});
  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({force: true});
  cy.wait(4000);
};

before(() => {
  loginAdmin();

  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title_for_admin).parent();
  // Testiin project bgaa esehiid davtaltaar shalgana
  project_list_group.children().each(($child, index, $list) => {

    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
    } else {
      if ($list["length"] - 1 === index) {
        console.log("LAST LOOP");
        // Creation of new project
        const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
        cy.get(btn_create_project).contains('Create Project').click({force: true});

        const modal_create_project = ".v-overlay__content > .v-card > .v-container > .v-form > .v-row";

        const modal_create_project_projectname = `${modal_create_project} > :nth-child(1).v-col input`;
        cy.get(modal_create_project_projectname).type(test_project_name);

        const modal_create_project_projectdesc = `${modal_create_project} > :nth-child(2).v-col textarea`;
        cy.get(modal_create_project_projectdesc).type(test_project_name + " project description");

        const modal_create_project_systemprompt = `${modal_create_project} > :nth-last-child(2).v-col .v-field__input`;
        cy.get(modal_create_project_systemprompt).type(test_project_name + " system prompt");

        const modal_create_project_btnsubmit = `${modal_create_project} > :nth-child(6).v-col button`;
        cy.get(modal_create_project_btnsubmit).contains('Create Project').click({force: true});

        cy.wait(4000);

        bProcessed = false;
        project_list_group = cy.get(container_project_list).contains(group_list_title_for_admin).parent();
        // Project-iig uusgesnii daraa dahij haij neene
        project_list_group.children().each(($child, index, $list) => {
          if (bProcessed) return;
          if ($child[0].innerText.startsWith(test_project_name)) {
            bProcessed = true;
            cy.wrap($child).should('contain.text', test_project_name);
            cy.wrap($child).contains("preview").click({force: true});

            const project_title = ".v-container > .v-row > :nth-child(1)";
            const project_title_element = cy.get(project_title);
            project_title_element.should('contain.text', test_project_name);
            const project_buttons = project_title_element.next();
            project_buttons.contains("URL Generate").click({force: true});

            cy.wait(30000);
          }
        });

      } else {
        console.log(index + ". Searching...");
      }
    }
  });
  logout();
});

beforeEach(() => {
  cy.visit(temp_guest_url);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({force: true});
  cy.get('.v-list > :nth-child(1)').click({force: true});
});

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

it("should display a field for entering password   - L1", () => {
  cy.get(tempguest_input_password).should('have.attr', 'type', 'password');
});

it("should allow login with register password  - L2", () => {
  cy.get(tempguest_input_password).type(temp_guest_password);
  cy.get(tempguest_btn_login).click({force: true});

  cy.get(tempguest_input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('include', `${base_url}/chat/`);

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
});

it("should not allow access without entering password - L3", () => {
  cy.get(tempguest_input_password).clear();
  cy.get(tempguest_btn_login).click({force: true});

  cy.get(tempguest_input_password_message).should('exist');
  cy.wait(2000);
  cy.url().should('eq', `${temp_guest_url}`);
});

it("should display an error message: 'This field is required' when password is not right - L4", () => {
  cy.get(tempguest_input_password).type(password_dummy);
  cy.get(tempguest_btn_login).click();
  cy.get('.v-alert__content').should('exist');
  cy.get('.v-alert__content').should('have.text', 'Password is incorrect. Please check and try again.');
  cy.url().should('eq', `${temp_guest_url}`);
});
