/// <reference types="cypress" />

const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(6).v-btn";
const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const email_admin = Cypress.env('email_manager');
const password_admin = Cypress.env('password_manager');

const group_list_title = "Invited projects";
const test_project_name_suffix = "_HOMEPAGE_ADMIN_AS_NOT_OWNER";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";

const get_test_div = ".v-row > .v-col";
const btn_project = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(2) > .text-subtitle-1";

const input_bot_name = 'input[placeholder*="Project Name"]';
const input_bot_description = 'textarea[placeholder*="Project Description"]';
const btn_bot_create = '.v-row > :nth-child(6).v-col button';
const input_system_prompt = 'textarea[placeholder*="System Prompt"]';

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

            // Test user-iig Owner bisheer nemne
            let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
            group_title.parent().get("button").contains("User Registration").click({ force: true });

            const selector_modal_input_email = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(1) input";
            cy.get(selector_modal_input_email).type(current_email);

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

const openProject = (onOpen) => {
  let bProcessed = false;
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
  project_list_group.children().each(($child, index, $list) => {
    if (bProcessed) return;
    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
      cy.wrap($child).should('contain.text', test_project_name);
      cy.wrap($child).contains("preview").click({force: true});
      onOpen();
    } else {
      if ($list["length"] - 1 === index) {
        console.log("LAST LOOP");
        throw new Error("Test project is not found");
      }
    }
  });
};

it("should when click to go to home page - H1", () => {
  cy.get('.app-bar-logo').click();
  cy.url().should('eq', `${base_url}/`);
});

it("should when click to reveal the Notifications dropdown. On the other hand, when the 'see all' button is pressed, the screen moves to the 'notice list' screen - H3", () => {
  const notification_icon = '.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content > i'
  cy.get(notification_icon).should('exist');
  cy.get(notification_icon).click({ force: true });
  const notification_menu = ".v-overlay > .v-overlay__content > .v-list";
  cy.get(notification_menu).should('exist');
  const notification_view_all_link = notification_menu + "> :nth-last-child(1)";
  cy.get(notification_view_all_link).click({ force: true });
  cy.url().should('eq', `${base_url}/notifications`);
});

it("should when click to show logout to non-admin users - H5", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });
  cy.wait(2000);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).should('contain.text', 'Logout')
  cy.wait(2000);

  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });
});

it("should allow selection from two options, Japanese and English, when the language switch is clicked - H8", () => {
  cy.get('[aria-owns="v-menu-4"]').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });
  const btn_create_project = ".v-container > :nth-child(1).v-row > .v-col > :nth-child(1)";
  cy.get(btn_create_project).should('have.text', 'Project');
  cy.get('[aria-owns="v-menu-4"]').click({ force: true });
  cy.get('.v-list > :nth-child(2)').click({ force: true });
  cy.get(btn_create_project).should('have.text', 'プロジェクト')
});

it("will logout - H9", () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });

  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).should('exist')
  cy.wait(4000);
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
});

it("should when click to display a modal to check detailed usage - H10", () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
  cy.wait(4000)
  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const user_guide = ".v-container > .v-row > .v-col > :nth-last-child(2)"
  cy.get(user_guide).should('exist')
  cy.get(user_guide).click({ force: true });
  cy.get('.text-blue-lighten-2 > .v-btn__content > .material-icons').click({ force: true });
  cy.wait(2000)
  const user_guide_model = ".v-overlay__content > .v-card >"
  cy.get(user_guide_model).should('exist');
  cy.wait(2000)
});

it("should when invitation project - H16", () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
  cy.wait(4000)
  const guide_modal_btn_close = ".v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn";
  cy.get(guide_modal_btn_close).contains('close').click({ force: true });

  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  cy.get(container_project_list).contains('Invited projects').should("exist");

  let invited_container = cy.get(container_project_list).contains('Invited projects').parent();
  const invited_project = invited_container.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  invited_project.should('exist');

  // cy.get('.v-toolbar__content > .v-btn > .v-btn__content > .material-icons').click({ force: true })
  // cy.get('.v-container > :nth-child(2) > :nth-child(2)').should('exist');
  // cy.get('.v-container > :nth-child(2) > :nth-child(2) > :nth-child(1)').should('have.text', 'Invited projects')
  // cy.get('.v-container > :nth-child(2) > :nth-child(1) > :nth-child(2)').should('exist');
});

it("should when lick to go to chat, H18.Click to go to bot details - H17", () => {
  openProject(() => {
    cy.get(".chat-wrapper-start").should("exist");

    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should('contain.text', test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({force: true});

    cy.get(".v-row").contains("Data Acquisition Process List").should("exist");
  });
});

it("Hide target project - H23, H24.Hidden project list, H25.Click to display the target project. Restore the original list.", () => {
  // H23.Hide target project
  let test_project_2_container = cy.get(get_test_div);
  cy.wait(1000);
  let test_project_2 = test_project_2_container.contains(group_list_title).parent();
  const currrent_div_2 = test_project_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  currrent_div_2.should('exist');
  currrent_div_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-red > .v-btn__content > .material-icons').click();

  cy.wait(10000);

  // H24.Hidden project list
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  cy.get(container_project_list).contains('Hidden projects').should("exist");
  // let project_list_group = cy.get(container_project_list).contains('Hidden projects').parent();
  // cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .v-col > :nth-child(1)').should('have.text', 'Hidden projects')
  let hidden_container = cy.get(container_project_list).contains('Hidden projects').parent();
  const hidden_project = hidden_container.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  hidden_project.should('exist');
  // hidden_project.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-red > .v-btn__content > .material-icons').click();
  // cy.get('.v-main > :nth-child(2) > :nth-child(2) > :nth-child(3) > .v-col-sm-12 ').should('exist');

  cy.wait(10000);

  // H25.Click to display the target project. Restore the original list
  currrent_div_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"] > .text-success > .v-btn__content > .material-icons').click()
  test_project_2 = cy.get(get_test_div).contains(group_list_title).parent();
  const currrent_div_3 = test_project_2.get('.v-col-sm-12 > .v-card > div[title*="' + test_project_name + '"]');
  currrent_div_3.should('exist');
  cy.wait(6000);
});

it("should when click to go to the top of the bot list - H26.", () => {
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

        // console.log(title, classlist);
        // console.log($childInner[0].children[0].children[1].children[3]);
        // console.log($childInner[0].children[0].children[1].children[3].classList);

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

it("sould when click to view bots in a grid or list - H27.", () => {
  const gridButton = ".v-main > .v-container > :nth-child(1).v-row > :nth-child(1).v-col > :nth-child(2).v-btn";
  const gridItems = ".v-main > .v-container > :nth-child(2) > :nth-child(1).v-row > .v-col-sm-12";
  const listButton = ".v-main > .v-container > :nth-child(1).v-row > :nth-child(1).v-col > :nth-child(3).v-btn";
  const listTable = ".v-main > .v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2).v-col > .v-table";
  cy.get(listButton).click({ force: true });
  cy.get(listTable).should('exist');
  cy.get(gridButton).click({ force: true });
  cy.get(gridItems).should('exist');
});
