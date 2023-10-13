/// <reference types="cypress" />

const btn_create_project =
  ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = ".v-form > .v-row > :nth-child(6) > .v-btn";
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = ".v-row > :nth-child(6).v-col button";
const input_name_message =
  ".v-container > .v-form > .v-row > :nth-child(1) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_description_message =
  ".v-form > .v-row > :nth-child(2)> .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const user_icon_button = ".v-toolbar__content > .v-container > button";
const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
const get_test_div = ".v-row > .v-col";
const color_setting_row = ".v-col > .text-caption";
const color_pick_modal_r =
  ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(1) > input";
const color_pick_modal_g =
  ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(2) > input";
const color_pick_modal_b =
  ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(3) > input";
const color_pick_modal_a =
  ".v-overlay__content > .v-sheet >  .v-color-picker__controls > .v-color-picker-edit > :nth-child(4) > input";
const chat_text_area = "";
const chat_bg = ".chat-wrapper-start > .v-card";
const chat_btn = "";
const bot = "";
const user = "";

const base_url = Cypress.env("host");
const current_email = Cypress.env("email_guest");
const current_password = Cypress.env("password_guest");
const email_admin = Cypress.env("email_admin");
const password_admin = Cypress.env("password_admin");

const group_list_title = "Invited projects";
const test_project_name =
  "Cypress test " +
  Math.floor(Date.now() / 1000) +
  "_PROJECT_DETAIL_GUEST_AS_NOT_OWNER";

const group_list_title_for_admin = "List of projects owned by me";

Cypress.on("uncaught:exception", (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});

// Testiin ehend admin-aar nevterch orood test project uuseegui bval uusgeh zorilgotoi
const loginAdmin = () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem("onboarding", "false");
    },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get(".v-list > :nth-child(1)").click({ force: true });

  cy.get(input_email).type(email_admin, { force: true });
  cy.get(input_password).type(password_admin, { force: true });
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should("not.exist");
  cy.get(input_password_message).should("not.exist");
  cy.wait(4000);
  cy.url().should("eq", `${base_url}/`);

  cy.wait(4000);

  const guide_modal_btn_close =
    ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains("close").click({ force: true });

  const user_icon =
    ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should("have.text", "account_circle");
};

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
  cy.wait(2000);
  cy.url().should("eq", `${base_url}/`);

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

before(() => {
  loginAdmin();

  let bProcessed = false;
  const container_project_list =
    ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy
    .get(container_project_list)
    .contains(group_list_title_for_admin)
    .parent();
  // Testiin project bgaa esehiid davtaltaar shalgana
  project_list_group.children().each(($child, index, $list) => {
    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
    } else {
      if ($list["length"] - 1 === index) {
        console.log("LAST LOOP");
        // Creation of new project
        const btn_create_project =
          ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
        cy.get(btn_create_project)
          .contains("Create Project")
          .click({ force: true });

        const modal_create_project =
          ".v-overlay__content > .v-card > .v-container > .v-form > .v-row";

        const modal_create_project_projectname = `${modal_create_project} > :nth-child(1).v-col input`;
        cy.get(modal_create_project_projectname).type(test_project_name);

        const modal_create_project_projectdesc = `${modal_create_project} > :nth-child(2).v-col textarea`;
        cy.get(modal_create_project_projectdesc).type(
          test_project_name + " project description"
        );

        const modal_create_project_systemprompt = `${modal_create_project} > :nth-last-child(2).v-col .v-field__input`;
        cy.get(modal_create_project_systemprompt).type(
          test_project_name + " system prompt"
        );

        const modal_create_project_btnsubmit = `${modal_create_project} > :nth-child(6).v-col button`;
        cy.get(modal_create_project_btnsubmit)
          .contains("Create Project")
          .click({ force: true });

        cy.wait(4000);

        bProcessed = false;
        project_list_group = cy
          .get(container_project_list)
          .contains(group_list_title_for_admin)
          .parent();
        // Project-iig uusgesnii daraa dahij haij neene
        project_list_group.children().each(($child, index, $list) => {
          if (bProcessed) return;
          if ($child[0].innerText.startsWith(test_project_name)) {
            bProcessed = true;
            cy.wrap($child).should("contain.text", test_project_name);
            cy.wrap($child).contains("preview").click({ force: true });

            const project_title = ".v-container > .v-row > :nth-child(1)";
            const project_title_element = cy.get(project_title);
            project_title_element.should("contain.text", test_project_name);
            const project_buttons = project_title_element.next();
            project_buttons.contains("Settings").click({ force: true });

            // Test user-iig Owner bisheer nemne
            let group_title = cy
              .get(".v-row > .v-col > .v-card > .v-row")
              .contains("User List");
            group_title
              .parent()
              .get("button")
              .contains("User Registration")
              .click({ force: true });

            const selector_modal_input_email =
              ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(1) input";
            cy.get(selector_modal_input_email).type(current_email);

            const selector_modal_submit =
              ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(3) button";
            cy.get(selector_modal_submit).click({ force: true });

            cy.wait(2000);

            const modal = ".v-overlay > .v-overlay__content > .v-card";
            cy.get(modal).should("not.exist");

            cy.wait(5000);
          }
        });
      } else {
        console.log(index + ". Searching...");
      }
    }
  });
  logout();
});

after(() => {
  loginAdmin();

  let bProcessed = false;
  const container_project_list =
    ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy
    .get(container_project_list)
    .contains(group_list_title_for_admin)
    .parent();
  // Testiin project bgaa esehiid davtaltaar shalgana
  project_list_group.children().each(($child, index, $list) => {
    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      // Deletion of test project
      cy.wrap($child).should("contain.text", test_project_name);
      cy.wrap($child).contains("delete").click({ force: true });

      const modal_delete = ".v-overlay__content > .v-card > .v-container";
      cy.get(modal_delete).contains("Delete Project").click({ force: true });

      cy.wait(10000);

      bProcessed = true;
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

it("should displays the project name (P1), Display project description (P2), system prompt is displayed (P3), A feature like project owners can share prompts (P4).Press into the prompt area to copy, Edit project name, description and system prompt (P7), transition to chat (P8)", () => {
  let bProcessed = false;
  let project_list_group = cy
    .get(container_project_list)
    .contains(group_list_title)
    .parent();
  project_list_group.children().each(($child, index, $list) => {
    if (bProcessed) return;
    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
      cy.wrap($child).should("contain.text", test_project_name);
      cy.wrap($child).contains("preview").click({ force: true });

      // P1
      cy.get(".text-h6").should("have.text", test_project_name);

      // P2
      cy.get(":nth-child(2) > .text-caption").should(
        "have.text",
        test_project_name + " project description"
      );

      // P3 System prompt show
      cy.get(":nth-child(3).v-col > .d-flex > .v-btn").should("not.exist");

      // P4 System prompt share/copy
      let project_title = ".v-container > .v-row > :nth-child(1)";
      let project_title_element = cy.get(project_title);
      project_title_element.should("contain.text", test_project_name);
      let project_buttons = project_title_element.next();
      project_buttons.contains("Settings").click({ force: true });

      let system_prompt_container = ".v-container > :nth-child(1).v-row";
      let system_prompt = ":nth-child(3).v-col > .v-alert > .v-alert__content";
      cy.get(system_prompt_container).find(system_prompt).should("not.exist");

      cy.wait(3000);

      // P7 Edit project button
      let project_buttons_container =
        ".v-container > :nth-child(1).v-row > .v-col-sm-12 > button";
      cy.get(project_buttons_container)
        .contains("Edit Project")
        .should("not.exist");

      // P8 Chat button
      cy.get(project_buttons_container).contains("Chat").should("exist");
    }
  });
});
