/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const btn_project = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(2) > .text-subtitle-1";
const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const btn_bot_create = '.v-row > :nth-child(6).v-col button';
const get_test_div = ".v-row > .v-col";

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_guest_owner');
const current_password = Cypress.env('password_guest_owner');
const email_admin = Cypress.env('email_admin');
const password_admin = Cypress.env('password_admin');

const group_list_title = "List of projects owned by me";
const test_project_name_suffix = "_HOMEPAGE_GUEST_AS_OWNER";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";

const wait_millisecond = 1000 * 5;

Cypress.on('uncaught:exception', (err) => {
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

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

  cy.get(input_email).type(email_admin, {force: true});
  cy.get(input_password).type(password_admin, {force: true});
  cy.get(btn_login).click({force: true});

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(4000);
  cy.url().should('eq', `${base_url}/`);

  cy.wait(4000);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({force: true});

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

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

  cy.get(input_email).type(current_email, { force: true });
  cy.get(input_password).type(current_password, { force: true });
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(6000);
  cy.url().should('eq', `${base_url}/`);

  cy.wait(4000);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.wait(2000);
};

const logout = () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
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
            project_buttons.contains("Settings").click({force: true});

            // Test user-iig Owner-oor nemne
            let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
            group_title.parent().get("button").contains("User Registration").click({force: true});

            const selector_modal_input_email = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(1) input";
            cy.get(selector_modal_input_email).type(current_email);

            const selector_modal_switch_owner = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(2) > .v-input > .v-input__control > .v-selection-control > .v-selection-control__wrapper > .v-selection-control__input > input";
            cy.get(selector_modal_switch_owner).check({ force: true });

            const selector_modal_submit = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(3) button";
            cy.get(selector_modal_submit).click({ force: true });

            cy.wait(10000);
          }
        });

      } else {
        console.log(index + ". Searching...");
      }
    }
  });
  logout();
});

const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
const recursiveDeletionProject = () => {
  let bProcessed = false;

  // Testiin project bgaa esehiid davtaltaar shalgana
  cy.get(container_project_list).contains(group_list_title_for_admin).parent().children().each(($child, index, $list) => {

    if (index === 0) return;

    if (bProcessed) return;

    if ($child[0].innerText.includes(test_project_name_suffix)) {
      // Deletion of test project
      cy.wrap($child).should('contain.text', test_project_name_suffix);
      cy.wrap($child).contains("delete").click({force: true});
      cy.wait(2000);

      const modal_delete = ".v-overlay__content > .v-card > .v-container";
      cy.get(modal_delete).contains("Delete Project").click({force: true});

      cy.wait(180000);

      cy.get(modal_delete).should("not.exist");

      recursiveDeletionProject();

      bProcessed = true;
    }
  });
};

after(() => {
  loginAdmin();

  cy.wait(10000);
  recursiveDeletionProject();

  logout();
});

beforeEach(() => {
  login();
});

afterEach(() => {
  logout();
});

it("should show List of projects I am in charge of - H11", () => {
  cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > .v-col').should('have.text', group_list_title);
  cy.get('.v-main > :nth-child(2) > :nth-child(2) > :nth-child(1)').should('exist');
});

it("should by click to go to chat - H12, H13.Click to go to bot details, H14.Click to show delete modal, H15.Click to clone the project. Project names and descriptions are duplicated, but files and items are not", () => {
  cy.get(btn_project).click({ force: true });
  cy.wait(2000)
  cy.get('.chat-wrapper').should('exist')
  cy.visit(base_url);
  cy.wait(3000);

  const test_project_1 = cy.get(get_test_div).contains(group_list_title).parent();
  test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').should('exist');
  cy.visit(base_url);
  cy.wait(3000);
  //edit button
  cy.get(':nth-child(1) > :nth-child(2) > .v-card > .mt-2 > .bg-orange-darken-1').click()
  cy.get(':nth-child(1) > .v-col > .text-subtitle-1').should('have.text', "System Prompt");
  // delete button
  cy.visit(base_url);
  cy.wait(3000);
  cy.get('.v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6) > .bg-error').click();
  cy.get('.v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-toolbar-title > .v-toolbar-title__placeholder').should('have.text', 'Delete Project')
  cy.get('.v-toolbar__content > .v-btn').click()
  // duplicate button
  cy.visit(base_url);
  cy.wait(3000);
  cy.get('.v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6) > .bg-blue').click();
  cy.get('.v-toolbar__content > .v-btn').click()
});

// it("H16 - USER_OWNER", () => {
//   cy.visit(base_url, {
//     onBeforeLoad(win) {
//       win.localStorage.setItem('onboarding', 'false')
//     },
//   });
//   cy.wait(4000)
//   const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
//   cy.get(guide_modal_btn_close).contains('close').click({ force: true });

//   cy.get('.v-toolbar__content > .v-btn > .v-btn__content > .material-icons').click({ force: true })
//   cy.get('.v-container > :nth-child(2) > :nth-child(3)').should('exist');
//   cy.get('.v-container > :nth-child(2) > :nth-child(3) > :nth-child(1)').should('have.text', 'Invited projects')
//   cy.get('.v-container > :nth-child(2) > :nth-child(1) > :nth-child(2)').should('exist');
// });

// it(" H17 , H18 - USER_OWNER", () => {
//   cy.get(btn_project).click({ force: true });
//   cy.wait(2000)
//   cy.get('.chat-wrapper').should('exist')
//   cy.visit(base_url);
//   cy.wait(3000);

//   const test_project_1 = cy.get('.v-row > .v-col').contains('List of projects owned by me').parent();
//   test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').should('exist');
//   cy.visit(base_url);
//   cy.wait(3000);

// });

