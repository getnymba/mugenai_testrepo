/// <reference types="cypress" />

const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input > input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';
const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = '.v-form > .v-row > :nth-last-child(1).v-col button';
const input_name_message = '.v-container > .v-form > .v-row > :nth-child(1) > .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_description_message = '.v-form > .v-row > :nth-child(2)> .v-input > .v-input__details > .v-messages > .v-messages__message';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';
const user_icon_button = '.v-toolbar__content > .v-container > button'
const delete_btn = '.v-overlay-container > .v-overlay >  .v-overlay__content > .v-card > .v-container > .v-row > nth-child(2) > button'
const username_input_msg = '.v-input__details > .v-messages > .v-messages__message'
const btn_project = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(2) > .text-subtitle-1";
const project_card = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6)";


const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const get_test_div = ".v-row > .v-col";

const group_list_title = "List of projects owned by me";
const test_project_name_suffix = "_HOMEPAGE_ADMIN_AS_OWNER";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";

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

  cy.get(input_email).type(current_email, {force: true});
  cy.get(input_password).type(current_password, {force: true});
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

const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
const recursiveDeletionProject = () => {
  let bProcessed = false;

  // Testiin project bgaa esehiid davtaltaar shalgana
  cy.get(container_project_list).contains(group_list_title).parent().children().each(($child, index, $list) => {

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
  login();

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

// it("H1.Click to go to home page", () => {
//   cy.get('.app-bar-logo').click();
//   cy.url().should('eq', `${base_url}/`);
// });

// it("H2.Click to display a new bot creation modal", () => {
//   cy.get('.small-text > .v-btn__content').click();
//   cy.get('.v-card > .v-container').should('exist')
// });

// it("H3.Click to reveal the Notifications dropdown. On the other hand, when the 'see all' button is pressed, the screen moves to the 'notice list' screen.", () => {
//   const notification_icon = '.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content > i'
//   cy.get(notification_icon).should('exist');
//   cy.get(notification_icon).click({ force: true });
//   const notification_menu = ".v-overlay > .v-overlay__content > .v-list";
//   cy.get(notification_menu).should('exist');
//   const notification_view_all_link = notification_menu + "> :nth-last-child(1)";
//   cy.get(notification_view_all_link).click({ force: true });
//   cy.url().should('eq', `${base_url}/notifications`);
// });

// it("H4.Click to display the dashboard, notification list, user list, and logout options for users with admin privileges.", () => {
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(2000);
//   cy.get('[href="/admin/notifications"]').should('exist');
//   cy.get('[href="/admin/user-management"]').should('exist');

//   const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
//   cy.get(btn_logout_container).should('contain.text', 'Logout')
//   cy.wait(4000);

//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });
// });

// it("H6.Click to move to the 'User Management' screen", () => {
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(2000);
//   cy.get('[href="/admin/notifications"]').should('exist');
//   cy.get('[href="/admin/user-management"]').should('exist');
//   const btn_users_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(3).v-list-item";
//   cy.get(btn_users_container).click({ force: true });
//   cy.wait(4000);
//   cy.url().should('eq', `${base_url}/admin/user-management`);
// });

// it("H7.Click to move to the notification management screen.", () => {
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(2000);
//   const btn_notifications_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
//   cy.get(btn_notifications_container).click({ force: true });
//   cy.wait(4000);
//   cy.url().should('eq', `${base_url}/admin/notifications`);
// });

// it("H8.By clicking on the language switch, you can choose between two options, Japanese and English.", () => {
//   cy.get('[aria-owns="v-menu-4"]').click({ force: true });
//   cy.get('.v-list > :nth-child(1)').click({ force: true });
//   const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(1)";
//   cy.get(btn_create_project).should('have.text', 'Project');
//   cy.get('[aria-owns="v-menu-4"]').click({ force: true });
//   cy.get('.v-list > :nth-child(2)').click({ force: true });
//   cy.get(btn_create_project).should('have.text', 'プロジェクト')
// });

// it("H9.Logout", () => {
//   cy.visit(base_url, {
//     onBeforeLoad(win) {
//       win.localStorage.setItem('onboarding', 'false')
//     },
//   });

//   const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
//   cy.get(guide_modal_btn_close).contains('close').click({ force: true });

//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
//   cy.get(btn_logout_container).should('exist')
//   cy.wait(4000);
//   cy.visit(base_url, {
//     onBeforeLoad(win) {
//       win.localStorage.setItem('onboarding', 'false')
//     },
//   });
// });

// it("H10.Click to display a modal to check detailed usage", () => {
//   cy.visit(base_url, {
//     onBeforeLoad(win) {
//       win.localStorage.setItem('onboarding', 'false')
//     },
//   });
//   cy.wait(4000)
//   const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
//   cy.get(guide_modal_btn_close).contains('close').click({ force: true });

//   const user_guide = ".v-container > .v-row > .v-col > :nth-last-child(2)"
//   cy.get(user_guide).should('exist')
//   cy.get(user_guide).click({ force: true });
//   cy.get('.text-blue-lighten-2 > .v-btn__content > .material-icons').click({ force: true });
//   cy.wait(2000)
//   const user_guide_model = ".v-overlay__content > .v-card >"
//   cy.get(user_guide_model).should('exist');
//   cy.wait(2000)
// });

// it("H11.List of projects I am in charge of", () => {
//   cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > .v-col').should('have.text', group_list_title)
//   cy.get('.v-main > :nth-child(2) > :nth-child(2) > :nth-child(1)').should('exist')
// });

// it("H12.Click to go to chat, H13.Click to go to bot details, H14.Click to show delete modal, H15.Click to clone the project. Project names and descriptions are duplicated, but files and items are not., H17.Click to go to chat, H18.Click to go to bot details, H21.Click to go to chat, H22.Click to go to bot details", () => {
//   cy.get(btn_project).click({ force: true });
//   cy.wait(2000)
//   cy.get('.chat-wrapper').should('exist')
//   cy.visit(base_url);
//   cy.wait(3000);

//   // create new project
//   cy.get(btn_create_project).contains('Create Project').click({ force: true });
//   cy.wait(2000)
//   cy.get(input_bot_name).should('exist');
//   cy.get(input_bot_name).type(test_project_name);
//   cy.get(input_bot_description).should('exist');
//   cy.get(input_bot_description).type(test_project_name + " description");
//   cy.get(input_system_prompt).type(test_project_name + ' system prompt');
//   cy.get(btn_bot_create).click();

//   const test_project_1 = cy.get(get_test_div).contains(group_list_title).parent();
//   test_project_1.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]').should('exist');
//   cy.visit(base_url);
//   cy.wait(3000);
//   //edit button
//   cy.get(':nth-child(1) > :nth-child(2) > .v-card > .mt-2 > .bg-orange-darken-1').click()
//   cy.get(':nth-child(1) > .v-col > .text-subtitle-1').should('have.text', "System Prompt");
//   // delete button
//   cy.visit(base_url);
//   cy.wait(3000);
//   cy.get('.v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6) > .bg-error').click();
//   cy.get('.v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-toolbar-title > .v-toolbar-title__placeholder').should('have.text', 'Delete Project')
//   cy.get('.v-toolbar__content > .v-btn').click()
//   // duplicate button
//   cy.visit(base_url);
//   cy.wait(3000);
//   cy.get('.v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6) > .bg-blue').click();
//   cy.get('.v-toolbar__content > .v-btn').click()
// });

// it("H16.invitation project", () => {
//   cy.visit(base_url, {
//     onBeforeLoad(win) {
//       win.localStorage.setItem('onboarding', 'false')
//     },
//   });
//   cy.wait(4000)
//   const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
//   cy.get(guide_modal_btn_close).contains('close').click({ force: true });

//   cy.get('.v-toolbar__content > .v-btn > .v-btn__content > .material-icons').click({ force: true })
//   cy.get('.v-container > :nth-child(2) > :nth-child(2)').should('exist');
//   cy.get('.v-container > :nth-child(2) > :nth-child(2) > :nth-child(1)').should('have.text', 'Invited projects')
//   cy.get('.v-container > :nth-child(2) > :nth-child(1) > :nth-child(2)').should('exist');
// });

// it("H19.List of projects created in the system, H20.Hide the list of projects created in the system", () => {
//   cy.get('.v-container > :nth-child(2) > :nth-child(3) > .v-col > :nth-child(1)').should('have.text', 'List of projects created in the system')
//   // cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .v-col > :nth-child(1)').should('have.text', 'List of projects created in the system')
//   cy.get('.v-main > .v-container > :nth-child(2) > :nth-child(3) > .v-col-sm-12 ').should('exist')
//   cy.get('.v-container > :nth-child(2) > :nth-child(3) > .v-col > button').click();
//   cy.get('.v-main > :nth-child(2) > :nth-child(2) > :nth-child(2)').should('be.visible')
// });

// it("H23.Hide target project, H24.Hidden project list, H25.Click to display the target project. Restore the original list.", () => {
//   // H23.Hide target project
//   let test_project_2_container = cy.get(get_test_div);
//   cy.wait(1000);
//   let test_project_2 = test_project_2_container.contains(group_list_title).parent();
//   const currrent_div_2 = test_project_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
//   currrent_div_2.should('exist');
//   currrent_div_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-red > .v-btn__content > .material-icons').click();

//   cy.wait(10000);

//   // H24.Hidden project list
//   const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
//   cy.get(container_project_list).contains('Hidden projects').should("exist");
//   // let project_list_group = cy.get(container_project_list).contains('Hidden projects').parent();
//   // cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .v-col > :nth-child(1)').should('have.text', 'Hidden projects')
//   let hidden_container = cy.get(container_project_list).contains('Hidden projects').parent();
//   const hidden_project = hidden_container.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
//   hidden_project.should('exist');
//   // hidden_project.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-red > .v-btn__content > .material-icons').click();
//   // cy.get('.v-main > :nth-child(2) > :nth-child(2) > :nth-child(3) > .v-col-sm-12 ').should('exist');

//   cy.wait(10000);

//   // H25.Click to display the target project. Restore the original list
//   currrent_div_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-success > .v-btn__content > .material-icons').click()
//   test_project_2 = cy.get(get_test_div).contains(group_list_title).parent();
//   const currrent_div_3 = test_project_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
//   currrent_div_3.should('exist');
//   cy.wait(6000);
// });

it("H26.Click to go to the top of the bot list", () => {
  let bProcessed = false;
  cy.get(container_project_list).contains(group_list_title).parent().children().each(($child, index, $list) => {
    if (index === 0) return;
    if (bProcessed) return;
    if ($child[0].innerText.includes(test_project_name)) {
      cy.wrap($child).should('contain.text', test_project_name);
      cy.wrap($child).contains("favorite").click({ force: true });
      bProcessed = true;
      cy.wait(5000);

      // check if test project in favorite state
      let bProcessedInner = false;
      let bFavoriteFinished = false;
      cy.get(container_project_list).contains(group_list_title).parent().children().each(($childInner, indexInner, $listInner) => {
        if (indexInner === 0) return;
        if (bProcessedInner) return;
        if (bFavoriteFinished) return;

        let title = $childInner[0].children[0].children[1].children[0].innerText;
        let classlist = $childInner[0].children[0].children[1].children[3].classList;

        cy.log(title, classlist);
        cy.log($childInner[0].children[0].children[1].children[3]);
        cy.log($childInner[0].children[0].children[1].children[3].classList);

        if (classlist["value"].includes("text-red")) {
          if (title.includes(test_project_name)) {
            cy.wrap($childInner).should('contain.text', test_project_name);
            cy.log(test_project_name + " IS MARKED AS FAVORITE AND FOUND IN GROUP OF FAVs IN TOP OF THE LIST");
            bProcessedInner = true;
            cy.wait(3000);
          }
        } else {
          bFavoriteFinished = true;
          throw new Error("Test project marked as FAVORITE is not found in TOP of list");
        }
      });
    }
  });
});

it("H27.Click to view bots in a grid or list", () => {
  const gridButton = ".v-main > .v-container > :nth-child(1).v-row > :nth-child(1).v-col > :nth-child(2).v-btn";
  const gridItems = ".v-main > .v-container > :nth-child(2) > :nth-child(1).v-row > .v-col-sm-12";
  const listButton = ".v-main > .v-container > :nth-child(1).v-row > :nth-child(1).v-col > :nth-child(3).v-btn";
  const listTable = ".v-main > .v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2).v-col > .v-table";
  cy.get(listButton).click({ force: true });
  cy.get(listTable).should('exist');
  cy.get(gridButton).click({ force: true });
  cy.get(gridItems).should('exist');
});
