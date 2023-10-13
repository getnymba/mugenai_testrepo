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
const delete_btn = '.v-overlay-container > .v-overlay >  .v-overlay__content > .v-card > .v-container > .v-row > nth-child(2) > button'
const username_input_msg = '.v-input__details > .v-messages > .v-messages__message'
const btn_project = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(2) > .text-subtitle-1";
const project_card = ".v-container > :nth-child(2) > :nth-child(1).v-row > :nth-child(2) > .v-card > :nth-child(6)";


const base_url = Cypress.env('host');
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const get_test_div = ".v-row > .v-col"
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

// const base_url = Cypress.env('host');
const current_email_manager = Cypress.env('email_manager');
const current_password_manager = Cypress.env('password_manager');
const current_email_user = Cypress.env('email_user');
const current_password_user = Cypress.env('password_user');
const current_email_guest = Cypress.env('email_guest');
const current_password_guest = Cypress.env('password_guest');

const new_notification_title = Math.floor(Date.now() / 1000) + "_cypress_test_title";
const new_notification_content = Math.floor(Date.now() / 1000) + "_cypress_test_description";

const dummy_notification_count = 25;

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

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

  cy.get(input_email).type(current_email_manager);
  cy.get(input_password).type(current_password_manager);
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

  cy.get(input_email).type(current_email_user);
  cy.get(input_password).type(current_password_user);
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

  cy.get(input_email).type(current_email_guest);
  cy.get(input_password).type(current_password_guest);
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
};

const logout = () => {
  cy.visit(base_url);
  cy.wait(4000);
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });
  cy.wait(500);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-last-child(1).v-list-item";
  cy.get(btn_logout_container).click({ force: true });
  cy.wait(3000);
};

before(() => {
  login();

  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
  cy.get(btn_notification_container).click({ force: true });
  cy.wait(4000);

  let total_elements = 0;
  let elements_from = 0;
  let elements_to = 0;

  // const footer_info = ".v-container > .v-row > .v-col > .v-table > .v-data-table-footer > .v-data-table-footer__info";
  const footer_info = ".v-container > .v-row > .v-col > .v-table > .v-row";
  cy.get(footer_info).invoke('text').then((text) => {
    const str_info = text.trim();
        cy.log("INFO: " + str_info);
        const array_info = str_info.split("Items per page：");
        const array_info1 = array_info[1].split("arrow_drop_down");
        const array_info2 = array_info1[1].split("-");
        const array_info3 = array_info2[1].split(" of ");
        total_elements = parseInt(array_info3[1].trim(), 10);
        elements_from = parseInt(array_info2[0].trim(), 10);
        elements_to = parseInt(array_info3[0].trim(), 10);
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

        // for (let counter = 0; counter < dummy_notification_count; counter++) {
        //   cy.get('.v-row > .d-flex > .v-btn').should('have.text','Create Notification').click();
        //   cy.get('input[placeholder*="Title"]').type((counter + 1) + '. ' + Math.floor(Date.now() / 1000) + '_cypress_test_title');
        //   cy.get('textarea[placeholder*="Notification"]').type((counter + 1) + '. ' + Math.floor(Date.now() / 1000) + '_cypress_test_description');
        //   cy.get('.v-row > :nth-child(3) > .v-btn').click();
        // }
  });
  logout();
});

const selector_table_body = ".v-main > .v-container > .v-row > :nth-child(3).v-col > .v-table > .v-table__wrapper > table > tbody";

const recursiveDeletion = (count) => {
  if (count < dummy_notification_count) {
    let processed = false;
    cy.get(selector_table_body).children().each(($child, index, $list) => {
      if (processed === true) return;
      if ($child[0].innerText.includes("_cypress_test_title")) {
        cy.log("FOUND: " + $child[0].innerText);
        cy.wrap($child).should('contain.text', "_cypress_test_title");
        // Deletion
        cy.wrap($child).contains("delete").click();
        cy.get('.v-toolbar__content > .v-toolbar-title > .v-toolbar-title__placeholder').should('have.text','Delete Notification')
        const selector_delete_btn = ".v-overlay > .v-overlay__content > .v-card > .v-container > .v-row > :nth-child(2).v-col > button";
        cy.get(selector_delete_btn).click({ force: true });
        cy.wait(2000);
        recursiveDeletion(count + 1);
        processed = true;
      }
    });
  }
};

// after(() => {
//   // To delete all dummy notifications
//   login();
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
//   cy.get(btn_notification_container).click({ force: true });
//   cy.wait(4000);

//   recursiveDeletion(0);
  
//   logout();
// });

beforeEach(() => {
  login();
});

afterEach(() => {
  logout();
});

function arrayEquals(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

it("N1.Notification list, N2.Notification creation, N4.You will see the created announcement. Press the close button to close the notification (ADMIN, MANAGER, USER, GUEST), N5.You can search in all columns.", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
  cy.get(btn_notification_container).click({ force: true });
  cy.wait(4000);
  cy.url().should('eq',`${base_url}/admin/notifications`)
  // cy.get('.v-row > .d-flex > .v-btn').should('have.text','Create Notification').click();
  // cy.get('input[placeholder*="Title"]').type(new_notification_title);
  // cy.get('textarea[placeholder*="Notification"]').type(new_notification_content);
  // cy.get('.v-row > :nth-child(3) > .v-btn').click();
  // cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text' , new_notification_title)
  // cy.get('.v-badge__badge').should('exist');
  // cy.get('.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content').click({force:true});
  // // cy.get('.v-overlay__content > .v-list > .v-list-item > .v-list-item__content').contains(new_notification_content).should('exist');
  // logout();
  // cy.wait(3000)
  // loginManager();
  // cy.get('.v-badge__badge').should('exist');
  // cy.get('.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content').click({force:true});
  // cy.get('.v-overlay__content > .v-list > .v-list-item > .v-list-item__content').contains(new_notification_content).should('exist');
  // logout();
  // loginUser();
  // cy.get('.v-badge__badge').should('exist');
  // cy.get('.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content').click({force:true});
  // cy.get('.v-overlay__content > .v-list > .v-list-item > .v-list-item__content').contains(new_notification_content).should('exist');
  // logout();
  // loginGuest();
  // cy.get('.v-badge__badge').should('exist');
  // cy.get('.v-toolbar > .v-toolbar__content > .v-container > :nth-child(3).v-btn > .v-btn__content').click({force:true});
  // cy.get('.v-overlay__content > .v-list > .v-list-item > .v-list-item__content').contains(new_notification_content).should('exist');

});

// it("N3.Title and notification content are required. Error message: This field is required", () => {
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(100);

//   const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
//   cy.get(btn_notification_container).click({ force: true });
//   cy.wait(4000);
//   cy.url().should('eq', `${base_url}/admin/notifications`)
//   cy.get('.v-row > .d-flex > .v-btn').should('have.text', 'Create Notification').click();
//   cy.get('.v-row > :nth-child(3) > .v-btn').click();
//   cy.wait(4000);
//   cy.get('.v-container >.v-form > .v-row >:nth-child(1) >.v-input > .v-input__details > .v-messages > .v-messages__message').should('exist');
//   cy.get('.v-container >.v-form > .v-row >:nth-child(2) >.v-input > .v-input__details > .v-messages > .v-messages__message').should('exist');
//   cy.get('.v-overlay-container > .v-overlay > .v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > .v-btn').click();
//   cy.wait(4000);
// });

it("N6.Sort by title, N7.Sort by notifications, N8.Sort by author, N9.Sort by creation date", () => {
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
  cy.get(btn_notification_container).click({ force: true });
  cy.wait(4000);

  let element_collector_title = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Title").click({ force: true });
  cy.wait(300);
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_title.push($child[0].children[0].innerText);
    if ($list["length"] - 1 === index) {
      let element_collector_title_sorted = [...element_collector_title];
      element_collector_title_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      cy.expect(arrayEquals(element_collector_title, element_collector_title_sorted)).to.be.equal(true);

      let element_collector_title_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Title").click({ force: true });
      cy.wait(300);
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_title_desc.push($child2[0].children[0].innerText);
        if ($list2["length"] - 1 === index2) {
          console.log("element_collector_title_desc", element_collector_title_desc);
          let element_collector_title_desc_sorted = [...element_collector_title_desc];
          const allEqual = element_collector_title_desc.every(val => val === element_collector_title_desc[0]);
          element_collector_title_desc_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log("element_collector_title_desc_sorted:", element_collector_title_desc_sorted);
          cy.expect(arrayEquals(element_collector_title_desc, element_collector_title_desc_sorted)).to.be.equal(allEqual ? true : false);
        }
      });
    }
  });

  let element_collector_body = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Notification").click({ force: true });
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_body.push($child[0].children[1].innerText);
    if ($list["length"] - 1 === index) {
      let elements_sorted = [...element_collector_body];
      elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      console.log("element_collector_body", element_collector_body);
      console.log("elements_sorted:", elements_sorted);
      cy.expect(arrayEquals(element_collector_body, elements_sorted)).to.be.equal(true);

      let element_collector_body_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Notification").click({ force: true });
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_body_desc.push($child2[0].children[1].innerText);
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

  let element_collector_date = [];
  cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Created at").click({ force: true });
  cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child, index, $list) => {
    element_collector_date.push($child[0].children[3].innerText);
    if ($list["length"] - 1 === index) {
      let elements_sorted = [...element_collector_date];
      elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      console.log("element_collector_date", element_collector_date);
      console.log("elements_sorted:", elements_sorted);
      cy.expect(arrayEquals(element_collector_date, elements_sorted)).to.be.equal(true);

      let element_collector_date_desc = [];
      cy.get(".v-table > .v-table__wrapper").find("table > thead").contains("Created at").click({ force: true });
      cy.get(".v-table > .v-table__wrapper").find("table > tbody").children().each(($child2, index2, $list2) => {
        element_collector_date_desc.push($child2[0].children[3].innerText);
        if ($list2["length"] - 1 === index2) {
          let elements_sorted = [...element_collector_date_desc];
          const allEqual = element_collector_date_desc.every(val => val === element_collector_date_desc[0]);
          elements_sorted.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log("element_collector_date_desc", element_collector_date_desc);
          console.log("elements_sorted:", elements_sorted);
          cy.expect(arrayEquals(element_collector_date_desc, elements_sorted)).to.be.equal(allEqual ? true : false);
        }
      });
    }
  });
});


// it("N12.When there are 10 or more notices, a pagination is displayed. Move to next and previous page. However, Pagination can be selected from the dropdown (10, 25, 50, 100, all).", () => {
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   const btn_notification_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list > :nth-child(1).v-list-item";
//   cy.get(btn_notification_container).click({ force: true });
//   cy.wait(4000);

//   let total_elements = 0;
//   let elements_from = 0;
//   let elements_to = 0;
//   let str_info = "";
//   let array_info = [];
//   let array_info1 = [];
//   let array_info2 = [];
//   let array_info3 = [];

//   const footer_info = ".v-container > .v-row > .v-col > .v-table > .v-row";
//   cy.get(".v-container > .v-row > .v-col > .v-table > .v-row").invoke('text').then((text) => {
//     str_info = text.trim();
//     cy.log("INFO: " + str_info);
//     array_info = str_info.split("Items per page：");
//     array_info1 = array_info[1].split("arrow_drop_down");
//     array_info2 = array_info1[1].split("-");
//     array_info3 = array_info2[1].split(" of ");
//     total_elements = parseInt(array_info3[1].trim(), 10);
//     elements_from = parseInt(array_info2[0].trim(), 10);
//     elements_to = parseInt(array_info3[0].trim(), 10);
//     cy.log("total_elements: " + total_elements);
//     cy.log("From: " + elements_from + ", To: " + elements_to);
//     let button_active_next = false;
//     let button_active_prev = false;
//     if (elements_to < total_elements) {
//       button_active_next = true;
//     }
//     if (elements_from > 1) {
//       button_active_prev = true;
//     }
//     cy.log("button_active_next: " + button_active_next);
//     cy.log("button_active_prev: " + button_active_prev);


//     if (button_active_next) {
//       const footer_buttons = ".v-container > .v-row > .v-col > .v-table > .v-row";
//       // Click on "next page"
//       cy.get(footer_buttons).contains("chevron_right").click();
//       cy.log("Click on 'next page'");
//       cy.wait(3000)
//       cy.get(".v-container > .v-row > .v-col > .v-table > .v-row").invoke('text').then((text2) => {
//         str_info = text2.trim();
//         cy.log("INFO: " + str_info);
//         array_info = str_info.split("Items per page：");
//         array_info1 = array_info[1].split("arrow_drop_down");
//         array_info2 = array_info1[1].split("-");
//         array_info3 = array_info2[1].split(" of ");
//         total_elements = parseInt(array_info3[1].trim(), 10);
//         const elements_from_2 = parseInt(array_info2[0].trim(), 10);
//         const elements_to_2 = parseInt(array_info3[0].trim(), 10);
//         cy.log("total_elements: " + total_elements);
//         cy.log("From: " + elements_from_2 + ", To: " + elements_to_2);
//         let button_active_next = false;
//         let button_active_prev = false;
//         if (elements_to_2 < total_elements) {
//           button_active_next = true;
//         }
//         if (elements_from_2 > 1) {
//           button_active_prev = true;
//         }
//         cy.log("button_active_next: " + button_active_next);
//         cy.log("button_active_prev: " + button_active_prev);
//         cy.expect(elements_to_2).to.be.greaterThan(elements_to);
//         const table_body = ".v-table > .v-table__wrapper > table > tbody";
//         cy.get(table_body).children().should("have.length", elements_to_2 - elements_from_2 + 1);
//         if (button_active_next) {





//           const footer_buttons = ".v-container > .v-row > .v-col > .v-table > .v-row";
//           // Click on "last page"
//           cy.get(footer_buttons).contains("last_page").click();
//           cy.log("Click on 'last page'");

//           cy.get(footer_info).invoke('text').then((text) => {
//             const str_info = text.trim();
//             cy.log("INFO: " + str_info);
//             array_info = str_info.split("Items per page：");
//             array_info1 = array_info[1].split("arrow_drop_down");
//             array_info2 = array_info1[1].split("-");
//             array_info3 = array_info2[1].split(" of ");
//             total_elements = parseInt(array_info3[1].trim(), 10);
//             const elements_from_3 = parseInt(array_info2[0].trim(), 10);
//             const elements_to_3 = parseInt(array_info3[0].trim(), 10);
//             cy.log("total_elements: " + total_elements);
//             cy.log("From: " + elements_from_3 + ", To: " + elements_to_3);
//             let button_active_next = false;
//             let button_active_prev = false;
//             if (elements_to_3 < total_elements) {
//               button_active_next = true;
//             }
//             if (elements_from_3 > 1) {
//               button_active_prev = true;
//             }
//             cy.log("button_active_next: " + button_active_next);
//             cy.log("button_active_prev: " + button_active_prev);
//             cy.expect(elements_to_3).to.be.equal(total_elements);
//             const table_body = ".v-table > .v-table__wrapper > table > tbody";
//             cy.get(table_body).children().should("have.length", elements_to_3 - elements_from_3 + 1);
//             if (button_active_prev) {
//               const footer_buttons = ".v-container > .v-row > .v-col > .v-table > .v-row";
//               // Click on "previous page"
//               cy.get(footer_buttons).contains("chevron_left").click();
//               cy.log("Click on 'previous page'");

//               cy.get(footer_info).invoke('text').then((text) => {
//                 const str_info = text.trim();
//                 cy.log("INFO: " + str_info);
//                 array_info = str_info.split("Items per page：");
//                 array_info1 = array_info[1].split("arrow_drop_down");
//                 array_info2 = array_info1[1].split("-");
//                 array_info3 = array_info2[1].split(" of ");
//                 total_elements = parseInt(array_info3[1].trim(), 10);
//                 const elements_from_4 = parseInt(array_info2[0].trim(), 10);
//                 const elements_to_4 = parseInt(array_info3[0].trim(), 10);
//                 cy.log("total_elements: " + total_elements);
//                 cy.log("From: " + elements_from_4 + ", To: " + elements_to_4);
//                 let button_active_next = false;
//                 let button_active_prev = false;
//                 if (elements_to_4 < total_elements) {
//                   button_active_next = true;
//                 }
//                 if (elements_from_4 > 1) {
//                   button_active_prev = true;
//                 }
//                 cy.log("button_active_next: " + button_active_next);
//                 cy.log("button_active_prev: " + button_active_prev);
//                 cy.expect(elements_from_4).to.be.lessThan(elements_from_3);
//                 const table_body = ".v-table > .v-table__wrapper > table > tbody";
//                 cy.get(table_body).children().should("have.length", elements_to_4 - elements_from_4 + 1);
//                 if (button_active_prev) {
//                   const footer_buttons = ".v-container > .v-row > .v-col > .v-table > .v-row";
//                   // Click on "first page"
//                   cy.get(footer_buttons).contains("first_page").click();
//                   cy.log("Click on 'first page'");

//                   cy.get(footer_info).invoke('text').then((text) => {
//                     const str_info = text.trim();
//                     cy.log("INFO: " + str_info);
//                     array_info = str_info.split("Items per page：");
//                     array_info1 = array_info[1].split("arrow_drop_down");
//                     array_info2 = array_info1[1].split("-");
//                     array_info3 = array_info2[1].split(" of ");
//                     total_elements = parseInt(array_info3[1].trim(), 10);
//                     const elements_from_5 = parseInt(array_info2[0].trim(), 10);
//                     const elements_to_5 = parseInt(array_info3[0].trim(), 10);
//                     cy.log("total_elements: " + total_elements);
//                     cy.log("From: " + elements_from_5 + ", To: " + elements_to_5);
//                     let button_active_next = false;
//                     let button_active_prev = false;
//                     if (elements_to_5 < total_elements) {
//                       button_active_next = true;
//                     }
//                     if (elements_from_5 > 1) {
//                       button_active_prev = true;
//                     }
//                     cy.log("button_active_next: " + button_active_next);
//                     cy.log("button_active_prev: " + button_active_prev);
//                     cy.expect(elements_from_5).to.be.equal(1);
//                     const table_body = ".v-table > .v-table__wrapper > table > tbody";
//                     cy.get(table_body).children().should("have.length", elements_to_5 - elements_from_5 + 1);
//                   });
//                 }
//               });
//             }
//           });






//         }
//       });
//     }
//   });



//   // SECTION FOR ITEMS PER PAGE DROPDOWN
//   // 25
//   const footer_items_per_page = ".v-table > .v-data-table-footer > .v-data-table-footer__items-per-page";
//   cy.get(footer_items_per_page).contains("arrow_drop_down").click();
//   const menu_item = ".v-overlay > .v-overlay__content > .v-list";
//   cy.get(menu_item).contains("25").click();
//   cy.get(footer_info).invoke('text').then((text) => {
//     const str_info = text.trim();
//     cy.log("INFO: " + str_info);
//     const array_info = str_info.split(" of ");
//     total_elements = parseInt(array_info[1].trim(), 10);
//     const array_current_page = array_info[0].trim().split("-");
//     elements_from = parseInt(array_current_page[0].trim(), 10);
//     elements_to = parseInt(array_current_page[1].trim(), 10);
//     cy.log("total_elements: " + total_elements);
//     cy.log("From: " + elements_from + ", To: " + elements_to);
//     cy.expect(elements_to - elements_from + 1).to.be.lessThan(25 + 1);
//     const table_body = ".v-table > .v-table__wrapper > table > tbody";
//     cy.get(table_body).children().should("have.length", elements_to - elements_from + 1);
//     let button_active_next = false;
//     let button_active_prev = false;
//     if (elements_to < total_elements) {
//       button_active_next = true;
//     }
//     if (elements_from > 1) {
//       button_active_prev = true;
//     }
//     cy.log("button_active_next: " + button_active_next);
//     cy.log("button_active_prev: " + button_active_prev);
//   });

//   // 50
//   cy.get(footer_items_per_page).contains("arrow_drop_down").click();
//   cy.get(menu_item).contains("50").click();
//   cy.get(footer_info).invoke('text').then((text) => {
//     const str_info = text.trim();
//     cy.log("INFO: " + str_info);
//     const array_info = str_info.split(" of ");
//     total_elements = parseInt(array_info[1].trim(), 10);
//     const array_current_page = array_info[0].trim().split("-");
//     elements_from = parseInt(array_current_page[0].trim(), 10);
//     elements_to = parseInt(array_current_page[1].trim(), 10);
//     cy.log("total_elements: " + total_elements);
//     cy.log("From: " + elements_from + ", To: " + elements_to);
//     cy.expect(elements_to - elements_from + 1).to.be.lessThan(50 + 1);
//     const table_body = ".v-table > .v-table__wrapper > table > tbody";
//     cy.get(table_body).children().should("have.length", elements_to - elements_from + 1);
//     let button_active_next = false;
//     let button_active_prev = false;
//     if (elements_to < total_elements) {
//       button_active_next = true;
//     }
//     if (elements_from > 1) {
//       button_active_prev = true;
//     }
//     cy.log("button_active_next: " + button_active_next);
//     cy.log("button_active_prev: " + button_active_prev);
//   });

//   // 100
//   cy.get(footer_items_per_page).contains("arrow_drop_down").click();
//   cy.get(menu_item).contains("100").click();
//   cy.get(footer_info).invoke('text').then((text) => {
//     const str_info = text.trim();
//     cy.log("INFO: " + str_info);
//     const array_info = str_info.split(" of ");
//     total_elements = parseInt(array_info[1].trim(), 10);
//     const array_current_page = array_info[0].trim().split("-");
//     elements_from = parseInt(array_current_page[0].trim(), 10);
//     elements_to = parseInt(array_current_page[1].trim(), 10);
//     cy.log("total_elements: " + total_elements);
//     cy.log("From: " + elements_from + ", To: " + elements_to);
//     cy.expect(elements_to - elements_from + 1).to.be.lessThan(100 + 1);
//     const table_body = ".v-table > .v-table__wrapper > table > tbody";
//     cy.get(table_body).children().should("have.length", elements_to - elements_from + 1);
//     let button_active_next = false;
//     let button_active_prev = false;
//     if (elements_to < total_elements) {
//       button_active_next = true;
//     }
//     if (elements_from > 1) {
//       button_active_prev = true;
//     }
//     cy.log("button_active_next: " + button_active_next);
//     cy.log("button_active_prev: " + button_active_prev);
//   });

//   // ALL
//   cy.get(footer_items_per_page).contains("arrow_drop_down").click();
//   cy.get(menu_item).contains("All").click();

//   cy.get(footer_info).invoke('text').then((text) => {
//     const str_info = text.trim();
//     cy.log("INFO: " + str_info);
//     const array_info = str_info.split(" of ");
//     total_elements = parseInt(array_info[1].trim(), 10);
//     const array_current_page = array_info[0].trim().split("-");
//     elements_from = parseInt(array_current_page[0].trim(), 10);
//     elements_to = parseInt(array_current_page[1].trim(), 10);
//     cy.log("total_elements: " + total_elements);
//     cy.log("From: " + elements_from + ", To: " + elements_to);
//     cy.expect(elements_to).to.be.equal(total_elements);
//     const table_body = ".v-table > .v-table__wrapper > table > tbody";
//     cy.get(table_body).children().should("have.length", elements_to - elements_from + 1);
//     let button_active_next = false;
//     let button_active_prev = false;
//     if (elements_to < total_elements) {
//       button_active_next = true;
//     }
//     if (elements_from > 1) {
//       button_active_prev = true;
//     }
//     cy.log("button_active_next: " + button_active_next);
//     cy.log("button_active_prev: " + button_active_prev);
//   });

// });
