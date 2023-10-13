import 'cypress-file-upload';
/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message input";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message input";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const email_admin = Cypress.env('usinv_email_admin');
const password_admin = Cypress.env('usinv_password_admin');

const group_list_title = "Invited projects";
const test_project_name_suffix = "_NEW_USER_INVITE_LIST_ADMIN_AS_NOT_OWNER";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";

const dummy_user_count = 13;
const dummy_user_timestamp = Math.floor(Date.now() / 1000);

const dummy_user_list = Cypress.env('dummy_user_list');

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

        const modal_create_project_btnsubmit = `${modal_create_project} > :nth-child(7).v-col button`;
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
            project_buttons.contains("settings").click({force: true});

            // Test user-iig Owner bisheer nemne
            let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
            group_title.parent().get("button").contains("User Registration").click({force: true});

            const selector_modal_input_email = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(1) input";
            cy.get(selector_modal_input_email).type(current_email, {force: true});

            const selector_modal_submit = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(3) button";
            cy.get(selector_modal_submit).click({ force: true });

            cy.wait(2000);

            const modal = ".v-overlay > .v-overlay__content > .v-card";
            cy.get(modal).should("not.exist");

            cy.wait(10000);

            // Turshiltiin user-uudiig uusgene
            for (let counter = 0; counter < dummy_user_count; counter++) {
              let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
              group_title.parent().get("button").contains("User Registration").click({force: true});

              const selector_modal_input_email = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(1) input";
              cy.get(selector_modal_input_email).type(dummy_user_list[counter]);

              const selector_modal_submit = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(3) button";
              cy.get(selector_modal_submit).click({ force: true });

              cy.wait(10000);

              const modal = ".v-overlay > .v-overlay__content > .v-card";
              cy.get(modal).should("not.exist");

              cy.wait(10000);

              // group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
              // group_title.parent().get("button").contains("User Registration").click({force: true});

              // cy.wait(3000);

              // cy.get(selector_modal_input_email).clear();

              // cy.get(selector_modal_input_email).type(dummy_user_list[counter]);

              // const selector_modal_switch_owner = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-form > .v-row > :nth-child(2) > .v-input > .v-input__control > .v-selection-control > .v-selection-control__wrapper > .v-selection-control__input > input";
              // cy.get(selector_modal_switch_owner).check({ force: true });

              // cy.get(selector_modal_submit).click({ force: true });

              // cy.wait(10000);

              // cy.get(modal).should("not.exist");

              // cy.wait(10000);
            }
          }
        });

      } else {
        console.log(index + ". Searching...");
      }
    }
  });
  logout();
});

const table_body = ".v-main > .v-container > .v-row > :nth-child(3).v-col > .v-table > .v-table__wrapper > table > tbody";
const recursiveDeletion = () => {
  let processed = false;
  cy.get(table_body).children().each(($child, index, $list) => {
    if (processed === true) return;
    if ($child[0].innerText.startsWith("testuser")) {
      cy.log("FOUND: " + $child[0].innerText);
      cy.wrap($child).should('contain.text', "testuser");
      // Deletion
      cy.wrap($child).contains("delete").click();
      cy.get('.v-toolbar__content > .v-toolbar-title > .v-toolbar-title__placeholder').should('have.text','Delete User')
      const selector_delete_btn = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-row > :nth-child(2).v-col > button";
      cy.get(selector_delete_btn).click({ force: true });
      cy.wait(20000);
      recursiveDeletion();
      processed = true;
    }
  });
};

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

      cy.wait(30000);

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

  cy.wait(4000);

  login();

  cy.wait(10000);
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_user_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(3).v-list-item";
  cy.get(btn_user_container).click({ force: true });
  cy.wait(10000);

  const search_field = ".v-main > .v-container > .v-row > :nth-child(2).v-col > .v-input > .v-input__control > .v-field > .v-field__field input";
  cy.get(search_field).type("testuser", { force: true });

  cy.wait(10000);
  recursiveDeletion();

  logout();
});

beforeEach(() => {
  login();
});

afterEach(() => {
  logout();
});

it("should enter email address to add user to project.When adding, select whether to become an administrator of this project or a general user.Add a guest role to newly registered users here.(N1)", () => {
  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
  project_list_group.children().each(($child, index, $list) => {
    // console.log("$child: ", $child[0].innerText);

    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
      cy.wrap($child).should('contain.text', test_project_name);
      cy.wrap($child).contains("preview").click({force: true});

      const project_title = ".v-container > .v-row > :nth-child(1)";
      const project_title_element = cy.get(project_title);
      project_title_element.should('contain.text', test_project_name);
      const project_buttons = project_title_element.next();
      project_buttons.contains("settings").click({force: true});

      for (let counter = 0; counter < 1; counter++) {
        let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
        group_title.parent().get("button").contains("User Registration").should("not.exist");//.click({force: true});
      }

    }
  });

  cy.wait(20000);
});

it("should check if the email address is not entered or there is an error in the email format, an error message will be displayed.error contents:Please enter your email address.The email address format is incorrect. (N2)", () => {
  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
  project_list_group.children().each(($child, index, $list) => {
    console.log("$child: ", $child[0].innerText);

    if (bProcessed) return;

    if ($child[0].innerText.startsWith(test_project_name)) {
      bProcessed = true;
      cy.wrap($child).should('contain.text', test_project_name);
      cy.wrap($child).contains("preview").click({force: true});

      const project_title = ".v-container > .v-row > :nth-child(1)";
      const project_title_element = cy.get(project_title);
      project_title_element.should('contain.text', test_project_name);
      const project_buttons = project_title_element.next();
      project_buttons.contains("settings").click({force: true});

      let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      group_title.parent().get("button").contains("User Registration").should("not.exist");
    }
  });

  cy.wait(2000);
});

it("It should show email address, username, role and action, N4.Display email address, username and role. (N3)", () => {
  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
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
      project_buttons.contains("settings").click({force: true});

      let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      let table_parent = group_title.parent().next();

      table_parent.find("table > thead > tr").children().each(($child, index, $list) => {
        switch (index) {
          case 0:
            cy.wrap($child).find("div > span").should("have.text", "Email");
            break;
          case 1:
            cy.wrap($child).find("div > span").should("have.text", "Username");
            break;
          case 2:
            cy.wrap($child).find("div > span").should("have.text", "Role");
            break;
          case 3:
            cy.wrap($child).find("div > span").should("not.exist");
            break;
          default:
            break;
        }
      });

      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      table_parent = group_title.parent().next();

      table_parent.find("table > tbody").children().each(($child, index, $list) => {
        // cy.wrap($child).children().should("have.length", 3);
        cy.wrap($child).children().each(($td, td_index, $td_list) => {
          switch (td_index) {
            case 0:
              // email
              cy.wrap($td).should('exist');
              break;
            case 1:
              // username
              cy.wrap($td).should('exist');
              break;
            case 2:
              // role
              cy.wrap($td).invoke('text').should('satisfy', (text) => text === 'Users' || text === 'Owner');
              break;
            default:
              break;
          }
        });
      });
    }
  });

  cy.wait(20000);
});

it("It should move to the previous page/next page. 10, 25, 50, 100, all users are included per page. (N5)", () => {
  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
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
      project_buttons.contains("settings").click({force: true});

      let total_elements = 0;
      let elements_from = 0;
      let elements_to = 0;

      let group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      let next = group_title.parent().next();
      const footer_info = ".d-flex.justify-center.align-center small";

      next.find(".d-flex.justify-center.align-center small").contains('of').invoke('text').then((text) => {
        const str_info = text.trim();
        cy.log("INFO: " + str_info);
        const array_info = str_info.split(" of ");
        total_elements = parseInt(array_info[1].trim(), 10);
        const array_current_page = array_info[0].trim().split("-");
        elements_from = parseInt(array_current_page[0].trim(), 10);
        elements_to = parseInt(array_current_page[1].trim(), 10);
        cy.log("total_elements: " + total_elements);
        cy.log("From: " + elements_from + ", To: " + elements_to);
        let button_active_next = false;
        let button_active_prev = false;
        if (elements_to < total_elements) {
          button_active_next = true;
        }
        if (elements_from > 1) {
          button_active_prev = true;
        }
        cy.log("button_active_next: " + button_active_next);
        cy.log("button_active_prev: " + button_active_prev);


        if (button_active_next) {
          group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
          next = group_title.parent().next();
          const footer_buttons = ".v-pagination__list";
          // Click on "next page"
          next.find(footer_buttons).contains("chevron_right").click();
          cy.log("Click on 'next page'");
          group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
          next = group_title.parent().next();
          next.find(footer_info).invoke('text').then((text) => {
            const str_info = text.trim();
            cy.log("INFO: " + str_info);
            const array_info = str_info.split(" of ");
            total_elements = parseInt(array_info[1].trim(), 10);
            const array_current_page = array_info[0].trim().split("-");
            let elements_from_2 = parseInt(array_current_page[0].trim(), 10);
            let elements_to_2 = parseInt(array_current_page[1].trim(), 10);
            cy.log("total_elements: " + total_elements);
            cy.log("From2: " + elements_from_2 + ", To2: " + elements_to_2);
            let button_active_next = false;
            let button_active_prev = false;
            if (elements_to_2 < total_elements) {
              button_active_next = true;
            }
            if (elements_from_2 > 1) {
              button_active_prev = true;
            }
            cy.log("button_active_next: " + button_active_next);
            cy.log("button_active_prev: " + button_active_prev);
            cy.expect(elements_to_2).to.be.greaterThan(elements_to);
            group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
            next = group_title.parent().next();
            const table_body = ".v-table > .v-table__wrapper > table > tbody";
            next.find(table_body).children().should("have.length", elements_to_2 - elements_from_2 + 1);
            if (button_active_next) {





              group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
              next = group_title.parent().next();
              const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
              // Click on "last page"
              next.find(footer_buttons).contains("last_page").click();
              cy.log("Click on 'last page'");

              group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
              next = group_title.parent().next();
              next.find(footer_info).contains('of').invoke('text').then((text) => {
                const str_info = text.trim();
                cy.log("INFO: " + str_info);
                const array_info = str_info.split(" of ");
                total_elements = parseInt(array_info[1].trim(), 10);
                const array_current_page = array_info[0].trim().split("-");
                let elements_from_3 = parseInt(array_current_page[0].trim(), 10);
                let elements_to_3 = parseInt(array_current_page[1].trim(), 10);
                cy.log("total_elements: " + total_elements);
                cy.log("From3: " + elements_from_3 + ", To3: " + elements_to_3);
                let button_active_next = false;
                let button_active_prev = false;
                if (elements_to_3 < total_elements) {
                  button_active_next = true;
                }
                if (elements_from_3 > 1) {
                  button_active_prev = true;
                }
                cy.log("button_active_next: " + button_active_next);
                cy.log("button_active_prev: " + button_active_prev);
                cy.expect(elements_to_3).to.be.equal(total_elements);
                group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                next = group_title.parent().next();
                const table_body = ".v-table > .v-table__wrapper > table > tbody";
                next.find(table_body).children().should("have.length", elements_to_3 - elements_from_3 + 1);
                if (button_active_prev) {
                  group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                  next = group_title.parent().next();
                  const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
                  // Click on "previous page"
                  next.find(footer_buttons).contains("chevron_left").click();
                  cy.log("Click on 'previous page'");

                  group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                  next = group_title.parent().next();
                  next.find(footer_info).contains('of').invoke('text').then((text) => {
                    const str_info = text.trim();
                    cy.log("INFO: " + str_info);
                    const array_info = str_info.split(" of ");
                    total_elements = parseInt(array_info[1].trim(), 10);
                    const array_current_page = array_info[0].trim().split("-");
                    let elements_from_4 = parseInt(array_current_page[0].trim(), 10);
                    let elements_to_4 = parseInt(array_current_page[1].trim(), 10);
                    cy.log("total_elements: " + total_elements);
                    cy.log("From4: " + elements_from_4 + ", To4: " + elements_to_4);
                    let button_active_next = false;
                    let button_active_prev = false;
                    if (elements_to_4 < total_elements) {
                      button_active_next = true;
                    }
                    if (elements_from_4 > 1) {
                      button_active_prev = true;
                    }
                    cy.log("button_active_next: " + button_active_next);
                    cy.log("button_active_prev: " + button_active_prev);
                    cy.expect(elements_from_4).to.be.lessThan(elements_from_3);
                    group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                    next = group_title.parent().next();
                    const table_body = ".v-table > .v-table__wrapper > table > tbody";
                    next.find(table_body).children().should("have.length", elements_to_4 - elements_from_4 + 1);
                    if (button_active_prev) {
                      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                      next = group_title.parent().next();
                      const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
                      // Click on "first page"
                      next.find(footer_buttons).contains("first_page").click();
                      cy.log("Click on 'first page'");

                      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                      next = group_title.parent().next();
                      next.find(footer_info).contains('of').invoke('text').then((text) => {
                        const str_info = text.trim();
                        cy.log("INFO: " + str_info);
                        const array_info = str_info.split(" of ");
                        total_elements = parseInt(array_info[1].trim(), 10);
                        const array_current_page = array_info[0].trim().split("-");
                        let elements_from_5 = parseInt(array_current_page[0].trim(), 10);
                        let elements_to_5 = parseInt(array_current_page[1].trim(), 10);
                        cy.log("total_elements: " + total_elements);
                        cy.log("From4: " + elements_from_5 + ", To4: " + elements_to_5);
                        let button_active_next = false;
                        let button_active_prev = false;
                        if (elements_to_5 < total_elements) {
                          button_active_next = true;
                        }
                        if (elements_from_5 > 1) {
                          button_active_prev = true;
                        }
                        cy.log("button_active_next: " + button_active_next);
                        cy.log("button_active_prev: " + button_active_prev);
                        cy.expect(elements_from_5).to.be.equal(1);
                        group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
                        next = group_title.parent().next();
                        const table_body = ".v-table > .v-table__wrapper > table > tbody";
                        next.find(table_body).children().should("have.length", elements_to_5 - elements_from_5 + 1);
                      });
                    }
                  });
                }
              });






            }
          });
        }
      });



      // SECTION FOR ITEMS PER PAGE DROPDOWN
      // 25
      const footer_items_per_page = ".v-field__append-inner";
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_items_per_page).contains("arrow_drop_down").click();
      const menu_item = ".v-overlay > .v-overlay__content > .v-list";
      cy.get(menu_item).contains("25").click();
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_info).contains('of').invoke('text').then((text) => {
        const str_info = text.trim();
        cy.log("INFO: " + str_info);
        const array_info = str_info.split(" of ");
        total_elements = parseInt(array_info[1].trim(), 10);
        const array_current_page = array_info[0].trim().split("-");
        elements_from = parseInt(array_current_page[0].trim(), 10);
        elements_to = parseInt(array_current_page[1].trim(), 10);
        cy.log("total_elements: " + total_elements);
        cy.log("From: " + elements_from + ", To: " + elements_to);
        cy.expect(elements_to - elements_from + 1).to.be.lessThan(25 + 1);
        group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
        next = group_title.parent().next();
        const table_body = ".v-table__wrapper > table > tbody";
        if(total_elements >= 25){
          next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
        }
        let button_active_next = false;
        let button_active_prev = false;
        if (elements_to < total_elements) {
          button_active_next = true;
        }
        if (elements_from > 1) {
          button_active_prev = true;
        }
        cy.log("button_active_next: " + button_active_next);
        cy.log("button_active_prev: " + button_active_prev);
      });

      // 50
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_items_per_page).contains("arrow_drop_down").click();
      cy.get(menu_item).contains("50").click();
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_info).contains('of').invoke('text').then((text) => {
        const str_info = text.trim();
        cy.log("INFO: " + str_info);
        const array_info = str_info.split(" of ");
        total_elements = parseInt(array_info[1].trim(), 10);
        const array_current_page = array_info[0].trim().split("-");
        elements_from = parseInt(array_current_page[0].trim(), 10);
        elements_to = parseInt(array_current_page[1].trim(), 10);
        cy.log("total_elements: " + total_elements);
        cy.log("From: " + elements_from + ", To: " + elements_to);
        cy.expect(elements_to - elements_from + 1).to.be.lessThan(50 + 1);
        group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
        next = group_title.parent().next();
        const table_body = ".v-table > .v-table__wrapper > table > tbody";
        if(total_elements >= 50){
          next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
        }
        let button_active_next = false;
        let button_active_prev = false;
        if (elements_to < total_elements) {
          button_active_next = true;
        }
        if (elements_from > 1) {
          button_active_prev = true;
        }
        cy.log("button_active_next: " + button_active_next);
        cy.log("button_active_prev: " + button_active_prev);
      });

      // 100
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_items_per_page).contains("arrow_drop_down").click();
      cy.get(menu_item).contains("100").click();
      group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      next = group_title.parent().next();
      next.find(footer_info).contains('of').invoke('text').then((text) => {
        const str_info = text.trim();
        cy.log("INFO: " + str_info);
        const array_info = str_info.split(" of ");
        total_elements = parseInt(array_info[1].trim(), 10);
        const array_current_page = array_info[0].trim().split("-");
        elements_from = parseInt(array_current_page[0].trim(), 10);
        elements_to = parseInt(array_current_page[1].trim(), 10);
        cy.log("total_elements: " + total_elements);
        cy.log("From: " + elements_from + ", To: " + elements_to);
        cy.expect(elements_to - elements_from + 1).to.be.lessThan(100 + 1);
        group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
        next = group_title.parent().next();
        const table_body = ".v-table > .v-table__wrapper > table > tbody";
        if(total_elements >= 100){
          next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
        }
        let button_active_next = false;
        let button_active_prev = false;
        if (elements_to < total_elements) {
          button_active_next = true;
        }
        if (elements_from > 1) {
          button_active_prev = true;
        }
        cy.log("button_active_next: " + button_active_next);
        cy.log("button_active_prev: " + button_active_prev);
      });

      // ALL
      // group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      // next = group_title.parent().next();
      // next.find(footer_items_per_page).contains("arrow_drop_down").click();
      // cy.get(menu_item).contains("All").click();

      // group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      // next = group_title.parent().next();
      // next.find(footer_info).contains('of').invoke('text').then((text) => {
      //   const str_info = text.trim();
      //   cy.log("INFO: " + str_info);
      //   const array_info = str_info.split(" of ");
      //   total_elements = parseInt(array_info[1].trim(), 10);
      //   const array_current_page = array_info[0].trim().split("-");
      //   elements_from = parseInt(array_current_page[0].trim(), 10);
      //   elements_to = parseInt(array_current_page[1].trim(), 10);
      //   cy.log("total_elements: " + total_elements);
      //   cy.log("From: " + elements_from + ", To: " + elements_to);
      //   cy.expect(elements_to).to.be.equal(total_elements);
      //   group_title = cy.get(".v-row > .v-col > .v-card > .v-row").contains("User List");
      //   next = group_title.parent().next();
      //   const table_body = ".v-table > .v-table__wrapper > table > tbody";
      //   next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
      //   let button_active_next = false;
      //   let button_active_prev = false;
      //   if (elements_to < total_elements) {
      //     button_active_next = true;
      //   }
      //   if (elements_from > 1) {
      //     button_active_prev = true;
      //   }
      //   cy.log("button_active_next: " + button_active_next);
      //   cy.log("button_active_prev: " + button_active_prev);
      // });
    }
  });

  cy.wait(20000);
});
