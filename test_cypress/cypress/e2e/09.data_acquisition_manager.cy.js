import 'cypress-file-upload';
/// <reference types="cypress" />

const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const current_email = Cypress.env('email_manager');
const current_password = Cypress.env('password_manager');

const group_list_title = "List of projects owned by me";
const test_project_name_suffix = "_DATA_ACQUISITION_MANAGER_AS_OWNER";
const test_project_name = "Cypress test " + Math.floor(Date.now() / 1000) + test_project_name_suffix;

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
  login();

  let bProcessed = false;
  const container_project_list = ".v-container > :nth-child(2) > .v-row > .v-col";
  let project_list_group = cy.get(container_project_list).contains(group_list_title).parent();
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
  // To delete all dummy guests
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

it("should check if you can upload a file from local by pressing the file selection button. Only pptx, pdf, excel, csv, word, txt formats can be uploaded. (D1)", () => {
  openProject(() => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should('contain.text', test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({force: true});

    for (let counter = 0; counter < 25; counter++) {
      const data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      data_acquisition_title.parent().get("button").contains("Data Acquisition").click({force: true});

      const files = ["Lorem_ipsum.pdf", "sampledatafootballplayers.xlsx", "derivative.pptx"];

      cy.get(".v-overlay__content > .v-card > .v-container input[type='file']").attachFile(files[Math.floor(Math.random() * files.length)]);
      cy.get(".v-overlay__content > .v-card > .v-container").contains('button', 'Upload').click({force: true});
      cy.wait(20000);
    }
  });
  cy.wait(5000);
});

it("should check file name, URL, process type, status, file size, chunk count, update date, and action are displayed.Only actions are not visible to project general users.(D4) Show status as completed, pending and failed. (D6)", () => {
  openProject(() => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should('contain.text', test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({force: true});

    cy.wait(1000);

    let data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    let next = data_acquisition_title.parent().next();
    const col1 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(1).v-data-table__td span";
    const col2 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(2).v-data-table__td span";
    const col3 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(3).v-data-table__td span";
    const col4 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(4).v-data-table__td span";
    const col5 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(5).v-data-table__td span";
    const col6 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(6).v-data-table__td span";
    const col7 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(7).v-data-table__td span";
    const col8 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(8).v-data-table__td span";
    next.find(col1).should('have.text', 'File Name');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col2).should('have.text', 'URL');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col3).should('have.text', 'Type');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col4).should('have.text', 'Status');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col5).should('have.text', 'File Size');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col6).should('have.text', 'Chunk Count');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col7).should('have.text', 'Date');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(col8).should('have.text', 'Actions');

    const td_col1 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(1)";
    const td_col2 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(2)";
    const td_col3 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(3)";
    const td_col4 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(4)";
    const td_col5 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(5)";
    const td_col6 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(6)";
    const td_col7 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(7)";
    const td_col8 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(8)";

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    // next.find(td_col1).should('have.text', 'Lorem_ipsum.pdf');
    next.find(td_col1).each(($el, index, $list) => {
      cy.wrap($el).invoke('text').should('satisfy', (text) => text === 'Lorem_ipsum.pdf' || text === 'derivative.pptx' || text === 'sampledatafootballplayers.xlsx');
    });

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col2).should('exist');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col3).should('exist');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    // next.find(td_col4).should('exist');
    next.find(td_col4).each(($el, index, $list) => {
      cy.wrap($el).invoke('text').should('satisfy', (text) => text === 'Done' || text === 'Pending' || text === 'Ongoing' || text === 'Failed');
    });

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col5).should('exist');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col6).should('exist');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col7).should('exist');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(td_col8).should('exist');
  });
  cy.wait(5000);
});

it("should delete the file (D7)", () => {
  openProject(() => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should('contain.text', test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({force: true});

    cy.wait(1000);

    let data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    let next = data_acquisition_title.parent().next();
    const col8 = ".v-table > .v-table__wrapper > table > thead > tr > :nth-child(8).v-data-table__td span";
    next.find(col8).should('have.text', 'Actions');

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    const td_col8 = ".v-table > .v-table__wrapper > table > tbody > tr > :nth-child(8)";
    next.find(td_col8).contains("button", 'delete').click({force: true});

    let file_delete_prompt_title = cy.get(".v-overlay > .v-overlay__content > .v-sheet").contains("Are you sure you want to delete this data?");
    next = file_delete_prompt_title.next();
    next.contains("span", 'Delete').click({force: true});
  });
});

it("should check if there is a dropdown in Pagination where you can choose from 10, 25, 50, 100, all. There are buttons to transition to the next page and the previous page. (D8)", () => {
  openProject(() => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should('contain.text', test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({force: true});

    cy.wait(1000);

    let data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    let next = data_acquisition_title.parent().next();
    const footer_info = ".v-table > .v-data-table-footer > .v-data-table-footer__info";
    let total_elements = 0;
    let elements_from = 0;
    let elements_to = 0;
    next.find(footer_info).invoke('text').then((text) => {
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
      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      next = data_acquisition_title.parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
      if (button_active_next) {
        data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
        next = data_acquisition_title.parent().next();
        const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
        // Click on "next page"
        next.find(footer_buttons).contains("chevron_right").click();
        cy.log("Click on 'next page'");
        data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
        next = data_acquisition_title.parent().next();
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
          data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
          next = data_acquisition_title.parent().next();
          const table_body = ".v-table > .v-table__wrapper > table > tbody";
          next.find(table_body).children().should("have.length", elements_to_2 - elements_from_2 + 1);
          if (button_active_next) {
            data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
            next = data_acquisition_title.parent().next();
            const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
            // Click on "last page"
            next.find(footer_buttons).contains("last_page").click();
            cy.log("Click on 'last page'");

            data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
            next = data_acquisition_title.parent().next();
            next.find(footer_info).invoke('text').then((text) => {
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
              data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
              next = data_acquisition_title.parent().next();
              const table_body = ".v-table > .v-table__wrapper > table > tbody";
              next.find(table_body).children().should("have.length", elements_to_3 - elements_from_3 + 1);
              if (button_active_prev) {
                data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                next = data_acquisition_title.parent().next();
                const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
                // Click on "previous page"
                next.find(footer_buttons).contains("chevron_left").click();
                cy.log("Click on 'previous page'");

                data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                next = data_acquisition_title.parent().next();
                next.find(footer_info).invoke('text').then((text) => {
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
                  data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                  next = data_acquisition_title.parent().next();
                  const table_body = ".v-table > .v-table__wrapper > table > tbody";
                  next.find(table_body).children().should("have.length", elements_to_4 - elements_from_4 + 1);
                  if (button_active_prev) {
                    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                    next = data_acquisition_title.parent().next();
                    const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
                    // Click on "first page"
                    next.find(footer_buttons).contains("first_page").click();
                    cy.log("Click on 'first page'");

                    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                    next = data_acquisition_title.parent().next();
                    next.find(footer_info).invoke('text').then((text) => {
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
                      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
                      next = data_acquisition_title.parent().next();
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
    const footer_items_per_page = ".v-table > .v-data-table-footer > .v-data-table-footer__items-per-page";
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_items_per_page).contains("arrow_drop_down").click();
    const menu_item = ".v-overlay > .v-overlay__content > .v-list";
    cy.get(menu_item).contains("25").click();
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_info).invoke('text').then((text) => {
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
      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      next = data_acquisition_title.parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
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
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_items_per_page).contains("arrow_drop_down").click();
    cy.get(menu_item).contains("50").click();
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_info).invoke('text').then((text) => {
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
      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      next = data_acquisition_title.parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
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
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_items_per_page).contains("arrow_drop_down").click();
    cy.get(menu_item).contains("100").click();
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_info).invoke('text').then((text) => {
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
      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      next = data_acquisition_title.parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
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
    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_items_per_page).contains("arrow_drop_down").click();
    cy.get(menu_item).contains("All").click();

    data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
    next = data_acquisition_title.parent().next();
    next.find(footer_info).invoke('text').then((text) => {
      const str_info = text.trim();
      cy.log("INFO: " + str_info);
      const array_info = str_info.split(" of ");
      total_elements = parseInt(array_info[1].trim(), 10);
      const array_current_page = array_info[0].trim().split("-");
      elements_from = parseInt(array_current_page[0].trim(), 10);
      elements_to = parseInt(array_current_page[1].trim(), 10);
      cy.log("total_elements: " + total_elements);
      cy.log("From: " + elements_from + ", To: " + elements_to);
      cy.expect(elements_to).to.be.equal(total_elements);
      data_acquisition_title = cy.get(".v-row").contains("Data Acquisition Process List");
      next = data_acquisition_title.parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
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

    cy.wait(2000);
  });
  cy.wait(5000);
});
