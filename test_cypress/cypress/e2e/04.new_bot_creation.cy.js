/// <reference types="cypress" />

const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = '.v-row > :nth-child(7).v-col button';
const input_name_message = '.v-container > .v-form > .v-row > :nth-child(1) > .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_description_message = '.v-form > .v-row > :nth-child(2)> .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const user_icon_button = '.v-toolbar__content > .v-container > button'
const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
const get_test_div = ".v-row > .v-col";

const base_url = Cypress.env('host');
const email_admin = Cypress.env('email_admin');
const password_admin = Cypress.env('password_admin');
const email_manager = Cypress.env('email_manager');
const password_manager = Cypress.env('password_manager');
const email_user = Cypress.env('email_user');
const password_user = Cypress.env('password_user');
const email_guest = Cypress.env('email_guest');
const password_guest = Cypress.env('password_guest');

const group_list_title = "List of projects owned by me";
const test_project_name_suffix = "_BOT_CREATION";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";
const group_list_title_for_user = "Invited projects";

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
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
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).type(email_admin);
  cy.get(input_password).type(password_admin);
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

const loginManager = () => {
  cy.visit(base_url, {
      onBeforeLoad(win) {
          win.localStorage.setItem('onboarding', 'false')
      },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).type(email_manager);
  cy.get(input_password).type(password_manager);
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

const loginUser = () => {
  cy.visit(base_url, {
      onBeforeLoad(win) {
          win.localStorage.setItem('onboarding', 'false')
      },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).type(email_user);
  cy.get(input_password).type(password_user);
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

const loginGuest = () => {
  cy.visit(base_url, {
      onBeforeLoad(win) {
          win.localStorage.setItem('onboarding', 'false')
      },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).type(email_guest);
  cy.get(input_password).type(password_guest);
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('eq', `${base_url}/`);

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
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

      cy.wait(60000);

      cy.get(modal_delete).should("not.exist");

      recursiveDeletionProject();

      bProcessed = true;
    }
  });
};

after(() => {
  loginManager();

  recursiveDeletionProject();
  cy.wait(20000);

  logout();

  loginAdmin();
  recursiveDeletionProject();


  // cy.visit(base_url);

  // const logo = ".v-main > .v-toolbar > .v-toolbar__content .app-bar-logo";
  // cy.get(logo).click();
  // const test_project_1 = cy.get(get_test_div).contains(group_list_title).parent();
  // const currrent_div = test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  // currrent_div.should('exist');
  // currrent_div.parent().contains("delete").click({ force: true });
  // const modal_delete = ".v-overlay__content > .v-card > .v-container";
  // cy.get(modal_delete).contains("Delete Project").click({ force: true });

  // cy.wait(4000);
  // logout();
  // cy.wait(4000);
  // loginAdmin();
  // cy.visit(base_url);
  // cy.wait(2000);

  // cy.get(logo).click();
  // const test_project_2 = cy.get(get_test_div).contains(group_list_title).parent();
  // const currrent_div_2 = test_project_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  // currrent_div_2.should('exist');
  // currrent_div_2.parent().contains("delete").click({ force: true });
  // const modal_delete_2 = ".v-overlay__content > .v-card > .v-container";
  // cy.get(modal_delete_2).contains("Delete Project").click({ force: true });

  // cy.wait(4000);
  logout();
});

afterEach(() => {
  logout();
});

it("B1 , B3 , B5 , B6 - ADMIN", () => {
  loginAdmin();
  cy.get(btn_create_project).contains('Create Project').click({ force: true });
  cy.wait(2000)
  cy.get(input_bot_name).should('exist');
  cy.get(input_bot_name).type(test_project_name);
  cy.get(input_bot_description).should('exist');
  cy.get(input_bot_description).type("cypress b1 description");
  cy.get(input_system_prompt).type('system prompt input check');
  cy.get(btn_bot_create).click();
  const test_project_1 = cy.get(get_test_div).contains(group_list_title).parent();
  test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').should('exist');
  cy.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').click();
  cy.wait(5000)
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "GPT 3.5 Turbo");
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").click({ force: true });
  const model_list_options = ".v-list >.v-list-item";
  cy.get(model_list_options).contains("GPT 4").click({ force: true });
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "GPT 4");
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").click({ force: true });
  cy.get(model_list_options).contains("GPT 3.5 Turbo").click({ force: true });
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "GPT 3.5 Turbo");
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").click({ force: true });
  cy.get(model_list_options).contains("Palm 2").click({ force: true });
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "Palm 2");
});

it("B2 , B4 - ADMIN", () => {
  loginAdmin();
  cy.get(btn_create_project).contains('Create Project').click({ force: true });
  cy.wait(2000)
  cy.get(btn_bot_create).click();
  cy.get(input_name_message).should("exist")
  cy.get(input_name_message).should("have.text", "This field is required")
  cy.get(input_description_message).should("exist")
  cy.get(input_description_message).should("have.text", "This field is required")
});

// it("B1 , B3 , B5 , B6 - MANAGER", () => {
//   loginManager();
//   cy.get(btn_create_project).contains('Create Project').click({ force: true });
//   cy.wait(2000)
//   cy.get(input_bot_name).should('exist');
//   cy.get(input_bot_name).type(test_project_name);
//   cy.get(input_bot_description).should('exist');
//   cy.get(input_bot_description).type("cypress b1 description");
//   cy.get(input_system_prompt).type('system prompt input check');
//   cy.get(btn_bot_create).click();
//   const test_project_1 = cy.get(get_test_div).contains(group_list_title).parent();
//   test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').should('exist');
// });

// it("B2 , B4 - MANAGER", () => {
//   loginManager();
//   cy.get(btn_create_project).contains('Create Project').click({ force: true });
//   cy.wait(2000)
//   cy.get(btn_bot_create).click();
//   cy.get(input_name_message).should("exist")
//   cy.get(input_name_message).should("have.text", "This field is required")
//   cy.get(input_description_message).should("exist")
//   cy.get(input_description_message).should("have.text", "This field is required")
// });

// it("B1 - USER", () => {
//   loginUser();
//   cy.get(btn_create_project).should("not.exist");
// });

// it("B1 - GUEST", () => {
//   loginGuest();
//   cy.get(btn_create_project).should("not.exist");
// });
