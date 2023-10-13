import "cypress-file-upload";
/// <reference types="cypress" />

const input_email =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message =
  ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message =
  ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = ".v-form > .v-row > :nth-child(6) > .v-btn";

const tempguest_input_password =
  ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const tempguest_input_password_message =
  ".v-form > .v-row > :nth-child(2) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const tempguest_btn_login = ".v-form > .v-row > :nth-child(3) > .v-btn";

const base_url = Cypress.env("host");
let temp_guest_url = Cypress.env("temp_guest_url");
let temp_guest_password = Cypress.env("temp_guest_password");

const email_admin = Cypress.env("email_admin");
const password_admin = Cypress.env("password_admin");

const group_list_title = "Invited projects";
const test_project_name_suffix = " item list by TEMP_GUEST";
const test_project_name = "Cypress test" + test_project_name_suffix;

const group_list_title_for_admin = "List of projects owned by me";

const item_name = Cypress.env("test_item_name") + "_name";
const item_dis = Cypress.env("test_item_name") + "_description";
let wait_time = 1000;

Cypress.on("uncaught:exception", (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});

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
  cy.visit(temp_guest_url);
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get(".v-list > :nth-child(1)").click({ force: true });

  cy.get(tempguest_input_password).type(temp_guest_password);
  cy.get(tempguest_btn_login).click({ force: true });

  cy.get(tempguest_input_password_message).should("not.exist");
  cy.wait(2000);
  cy.url().should("include", `${base_url}/chat/`);

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
            let project_title_element = cy.get(project_title);
            project_title_element.should("contain.text", test_project_name);
            let project_buttons = project_title_element.next();
            project_buttons.contains("URL Generate").click({ force: true });

            const url_generate_modal_url =
              ".v-overlay > .v-overlay__content > .v-card > .v-container > :nth-child(2).v-row > .v-col.d-inline-block.text-truncate";
            cy.get(url_generate_modal_url)
              .invoke("text")
              .then((text) => {
                cy.log("URL: " + text);
                temp_guest_url = text;
              });
            const url_generate_modal_password =
              ".v-overlay > .v-overlay__content > .v-card > .v-container > :nth-child(4).v-row > .v-col.d-inline-block.text-truncate";
            cy.get(url_generate_modal_password)
              .invoke("text")
              .then((text) => {
                cy.log("PASSWORD: " + text);
                temp_guest_password = text;
              });

            const url_generate_modal_close =
              ".v-overlay > .v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content > button";
            cy.get(url_generate_modal_close).click({ force: true });

            cy.wait(500);

            project_title_element = cy.get(project_title);
            project_title_element.should("contain.text", test_project_name);
            project_buttons = project_title_element.next();
            project_buttons.contains("Settings").click({ force: true });

            // Turshiltiin file-uudiig upload hiine
            // let group_title_item = cy.get(".v-row > .v-col > .v-card > .v-row").contains("Item List");
            // let next = group_title_item.parent();
            // next.find('button').contains(' CSV Upload').click();
            // cy.get('input[type="file"]').attachFile('dummy.csv');
            // cy.get('button[type="button"].v-btn.v-btn--block.v-btn--flat.v-theme--darkTheme.bg-primary.v-btn--density-comfortable.v-btn--size-default.v-btn--variant-elevated.small-text').click();
            // //wait until upload over
            // cy.wait(35000);

            //Creating new item
            create_item();
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
  cy.get(container_project_list)
    .contains(group_list_title_for_admin)
    .parent()
    .children()
    .each(($child, index, $list) => {
      if (index === 0) return;

      if (bProcessed) return;

      if ($child[0].innerText.includes(test_project_name_suffix)) {
        // Deletion of test project
        cy.wrap($child).should("contain.text", test_project_name_suffix);
        cy.wrap($child).contains("delete").click({ force: true });
        cy.wait(2000);

        const modal_delete = ".v-overlay__content > .v-card > .v-container";
        cy.get(modal_delete).contains("Delete Project").click({ force: true });

        cy.wait(wait_time * 4);

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

describe("Item list field function check by Temporary role, project user", () => {
  it("should check the item name, item description, and creation date are displayed. (I1)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    //checking item details
    const item_path = ".v-table > .v-table__wrapper > table > tbody > tr > td";
    cy.get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List")
      .wait(wait_time)
      .parent()
      .next()
      .find(item_path)
      .then((next) => {
        cy.wrap(next).eq(1).should("contain", item_name);
        cy.wrap(next).eq(2).should("contain", item_dis);

        // check  date
        cy.wrap(next)
          .eq(3)
          .invoke("text")
          .then((dateText) => {
            cy.log(dateText);
          });
      });
  });

  it("should check the item name, item description, creation date, and action buttons are displayed. (I2)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    //checking item details
    const item_path = ".v-table > .v-table__wrapper > table > tbody > tr > td";
    cy.get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List")
      .wait(wait_time)
      .parent()
      .next()
      .find(item_path)
      .then((next) => {
        cy.wrap(next).eq(1).should("contain", item_name);
        cy.wrap(next).eq(2).should("contain", item_dis);

        // check  date
        cy.wrap(next)
          .eq(3)
          .invoke("text")
          .then((dateText) => {
            cy.log(dateText);
          });

        // check edit and delete buttons
        cy.wrap(next).eq(4).should("not.exist", "edit");
        cy.wrap(next).eq(4).should("not.exist", "delete");
      });
  });

  it("should search for an item. (I3)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    cy.wait(wait_time).get('input[placeholder="Item search"]').type(item_name);
    cy.get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List")
      .wait(wait_time)
      .parent()
      .next()
      .then((next) => {
        const item_path =
          ".v-table > .v-table__wrapper > table > tbody > tr > td";
        cy.wrap(next).find(item_path).should("contain", item_name);
      });
  });

  it("should display the item image. (I4)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    let group_title_item = cy.get(".v-row").contains("Item List");
    let next = group_title_item.parent().next();
    const item_path =
      ".v-table > .v-table__wrapper > table > tbody > tr:nth-child(1) > td.py-2 > div > div > div > div > div > div.v-responsive__content > div > div.v-responsive.v-img > img";
    next.find(item_path).should("have.class", "v-img__img");
  });

  it("should edit the item name and item description. Delete the item. (I5, I6)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    cy.get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List")
      .wait(wait_time)
      .parent()
      .next()
      .then((next) => {
        const item_path = ".v-table > .v-table__wrapper > table > tbody";
        cy.wait(1000);
        cy.wrap(next).find(item_path).find("button.edit").should("not.exist");
        cy.wrap(next).find(item_path).find("button.delete").should("not.exist");
      });
  });

  it("should upload an image from local storage. Enlarge and Delete the uploaded image. (I7, I8, I9)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    //find add delete zoom button
    cy.wait(wait_time / 2)
      .get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List")
      .wait(wait_time)
      .parent()
      .next()
      .then((next) => {
        const item_path =
          ".v-table > .v-table__wrapper > table > tbody > tr > td";
        cy.wrap(next)
          .find(item_path)
          .contains(item_name)
          .prev()
          .then((next) => {
            cy.wrap(next).find("button.add").should("not.exist");
            cy.wrap(next).find("button.delete").should("not.exist");
            cy.get(next).contains("zoom_in").click();
            const close_buttom_path =
              ".v-overlay > .v-overlay__content > .v-card > .v-toolbar > .v-toolbar__content";
            cy.get(close_buttom_path).contains("close").click();
          });
      });
  });

  it("should upload a CSV file from local storage that contains two columns-*title* for the item name, and *description* for the item description, with the character encoding set as UTF-8. (I10)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    let group_title_item = cy
      .get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List");
    let next = group_title_item.parent();
    next.find("button").should("not.exist", " CSV Upload");
    // next.find('button').contains(' CSV Upload').click();
    // cy.get('input[type="file"]').attachFile('dummy.csv');
    // cy.get('button[type="button"].v-btn.v-btn--block.v-btn--flat.v-theme--darkTheme.bg-primary.v-btn--density-comfortable.v-btn--size-default.v-btn--variant-elevated.small-text').click();
    // //wait until upload over
    // cy.wait(35000);
  });

  it("should enter the item name and item description to add an item. Uploading an image is optional. (I11)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    let group_title_item = cy
      .get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List");
    let next = group_title_item.parent();
    next.find("button").should("not.exist", "Add Item");
  });

  it("should go to the previous page, go to the next page, move to the designated page. One page includes ten files. (I12)", () => {
    const project_title = ".v-container > .v-row > :nth-child(1)";
    const project_title_element = cy.get(project_title);
    project_title_element.should("contain.text", test_project_name);
    const project_buttons = project_title_element.next();
    project_buttons.contains("Settings").click({ force: true });

    let group_title = cy
      .get(".v-row > .v-col > .v-card > .v-row")
      .contains("Item List");
    let next = group_title.parent().next();
    const table_body = ".v-table > .v-table__wrapper > table > tbody";
    next
      .find(table_body)
      .children()
      .each(($child, index, $list) => {
        cy.expect($list["length"]).to.be.lessThan(11);
        const button_path = ".v-row > .v-col > .v-table > .d-flex";
        cy.get(button_path)
          .contains("Next")
          .then(($nav) => {
            if ($nav[0].getAttribute("disabled") == null) {
              cy.wrap($nav[0]).click({ force: true });
            }
          });
        cy.get(button_path).contains("Start").click({ force: true });
      });
  });

  //discribe function end
});

const create_item = () => {
  //Creating new item
  let group_title_item = cy
    .get(".v-row > .v-col > .v-card > .v-row")
    .contains("Item List");
  let next = group_title_item.parent();
  next.find("button").contains("Add Item").click();
  cy.get('input[placeholder="Item Name"]').type(item_name);
  cy.get("textarea.v-field__input").type(item_dis);
  cy.get('input[type="file"]').attachFile("DUMMYPIC.png");
  cy.wait(wait_time);
  cy.get(
    ".v-btn.v-btn--block.v-btn--flat.v-theme--darkTheme.bg-primary.v-btn--density-comfortable.v-btn--size-default.v-btn--variant-elevated.small-text"
  ).click();
  cy.wait(wait_time * 4);
  cy.reload(true);
};

const delete_item = () => {
  //find add delete zoom button
  cy.wait(wait_time / 2)
    .get(".v-row > .v-col > .v-card > .v-row")
    .contains("Item List")
    .wait(wait_time)
    .parent()
    .next()
    .then((next) => {
      const item_path =
        ".v-table > .v-table__wrapper > table > tbody > tr > td";
      cy.wrap(next)
        .find(item_path)
        .contains(item_name)
        .parent()
        .find(".text-right")
        .then((next) => {
          cy.get(next).contains("delete").click();
        });
    });
  const guide_modal_btn_close = ".v-overlay > .v-overlay__content > .v-sheet";
  cy.get(guide_modal_btn_close).contains("close").click({ force: true });
};
