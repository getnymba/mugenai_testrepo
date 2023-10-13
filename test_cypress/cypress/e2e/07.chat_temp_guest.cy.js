/// <reference types="cypress" />

const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = '.v-row > :nth-child(6).v-col button';
const input_name_message = '.v-container > .v-form > .v-row > :nth-child(1) > .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_description_message = '.v-form > .v-row > :nth-child(2)> .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const user_icon_button = '.v-toolbar__content > .v-container > button'
const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
const get_test_div = ".v-row > .v-col";
const color_setting_row = ".v-col > .text-caption"
const color_pick_modal_r = ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(1) > input"
const color_pick_modal_g = ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(2) > input"
const color_pick_modal_b = ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(3) > input"
const color_pick_modal_a = ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(4) > input"
const chat_text_area = ""
const chat_bg = ".chat-wrapper-start > .v-card"
const chat_btn = ""
const bot = ""
const user = ""

const tempguest_input_password = ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const tempguest_input_password_message = ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const tempguest_btn_login = '.v-form > .v-row > :nth-child(3) > .v-btn';

const base_url = Cypress.env('host');
let temp_guest_url = Cypress.env('temp_guest_url_chat');
let temp_guest_password = Cypress.env('temp_guest_password_chat');

const email_admin = Cypress.env('email_admin');
const password_admin = Cypress.env('password_admin');

const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + "_CHAT_TEMP_GUEST";

const group_list_title_for_admin = "List of projects owned by me";

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

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
  cy.log("VISITING: " + temp_guest_url);
  cy.visit(temp_guest_url);
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({force: true});
  cy.get('.v-list > :nth-child(1)').click({force: true});

  cy.get(tempguest_input_password).type(temp_guest_password);
  cy.get(tempguest_btn_login).click({force: true});

  cy.get(tempguest_input_password_message).should('not.exist');
  cy.wait(2000);
  cy.url().should('include', `${base_url}/chat/`);

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
};

const logout = () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(1000);
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

            const url_generate_modal_url = ".v-overlay > .v-overlay__content > .v-card > .v-container > :nth-child(2).v-row > .v-col.d-inline-block.text-truncate";
            cy.get(url_generate_modal_url).invoke('text').then(text => {
              cy.log("URL: " + text);
              temp_guest_url = text;
            });
            const url_generate_modal_password = ".v-overlay > .v-overlay__content > .v-card > .v-container > :nth-child(4).v-row > .v-col.d-inline-block.text-truncate";
            cy.get(url_generate_modal_password).invoke('text').then(text => {
              cy.log("PASSWORD: " + text);
              temp_guest_password = text;
            });

            const url_generate_modal_close = ".v-overlay > .v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > button";
            cy.get(url_generate_modal_close).click({force: true});

            // cy.wait(30000);
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
  login();
});

afterEach(() => {
  logout();
});

after(() => {
  loginAdmin();
  
  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title_for_admin).parent();
  // Testiin project bgaa esehiid davtaltaar shalgana
  project_list_group.children().each(($child, index, $list) => {

    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      // Deletion of test project
      cy.wrap($child).should('contain.text', test_project_name);
      cy.wrap($child).contains("delete").click({force: true});

      const modal_delete = ".v-overlay__content > .v-card > .v-container";
      cy.get(modal_delete).contains("Delete Project").click({force: true});

      cy.wait(10000);

      bProcessed = true;
    }
  });
  logout();
});

it("should Show bot name, bot description is displayed, Displays a button that can display a system prompt, You will see the chat between the bot and the user, Click to enter a message to the bot, change the model, Generate a URL. A modal appears where you can copy the URL and password, A message is sent to the bot, Transition to project details C1-C10", () => {
  // C1
  cy.get('.text-h6').should('have.text', test_project_name)

  // C2
  cy.get(':nth-child(2) > .text-caption').should('have.text', test_project_name + " project description")

  // C3 System prompt
  cy.get(':nth-child(3).v-col > .d-flex > .v-btn').should('not.exist');

  // C4 Chat conversation area
  cy.get('.chat-wrapper-start > .v-card > .v-row > .chat-wrapper').should('exist');

  // C5 Message input area
  cy.get('.chat-wrapper-start > .v-card > .v-row > .v-col > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input').should('exist');
  cy.get('.chat-wrapper-start > .v-card > .v-row > .v-col > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input').type('message submit test');

  // C6 model selector
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "gpt");
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > .v-select__selection").click({ force: true });
  const model_list_options1 = ".v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item > .v-list-item__content > .v-list-item-title";
  const model_list_options2 = ".v-overlay > .v-overlay__content > .v-list > :nth-child(2).v-list-item > .v-list-item__content > .v-list-item-title";
  cy.get(model_list_options1).click({ force: true });
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "gpt-4");
  cy.get(model_list_options2).click({ force: true });
  cy.get(".v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12 > .v-input > .v-input__control > .v-field").should("contain.text", "gpt-3.5-turbo");
  // C7 URL creation
  cy.get('.v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12').contains("URL Generate").should('not.exist');
  // cy.get('.v-overlay__content').should('exist');
  // cy.get('.v-toolbar__content > .v-btn').click();
  // C8 Submit
  cy.get('.chat-wrapper-start > .v-card > .v-row > .v-col > .v-input > .v-input__control > .v-field > .v-field__append-inner > .v-btn').click();
  cy.get('.chat-wrapper-start > .v-card > .v-row > .v-col > div > .user-chat-wrapper > .user-chat').should('have.text', "message submit test");
  // reply from BOT
  cy.get('.chat-wrapper-start > .v-card > .v-row > .v-col > div > .bot-chat-wrapper > .bot-chat').should('exist');

  // C9
  cy.get('.v-main > .v-container > .v-row > .v-col-sm-12').contains("Customize").should('not.exist');

  // C10 Project settings (detail)
  cy.get('.v-main > .v-container > .v-row > :nth-child(2).v-col-sm-12').contains("Settings").click({ force: true });
  cy.url().should('include', '/bot');
  // // widget
  // cy.get('.v-toolbar__content > .v-btn').click();
  // cy.get('.v-col-sm-12.align-self-center > :nth-child(4)').click();
  // cy.get('.v-card > .v-container').should('exist');
  // cy.url
});
