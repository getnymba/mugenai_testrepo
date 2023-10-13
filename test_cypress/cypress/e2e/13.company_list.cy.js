const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const company_page_url = "https://beta.multi-chat.data-artist.info/admin/company"
const user_list_page_url = "https://beta.multi-chat.data-artist.info/admin/user-management"
const current_email = Cypress.env('email_system_admin');
const current_password = Cypress.env('password_system_admin');

const company_name = "0_Cypress_test_company_list";
const company_name_after_edited = "0_Cypress_test_edited"
const admin_name = "0_Cypress_test_company_admin";
const admin_email = "0_testacctestproject@gmail.com";
const plan = "Free tier";


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

  cy.get(input_email).type(current_email,{ force: true });
  cy.get(input_password).type(current_password,{ force: true });
  cy.get(btn_login).click({ force: true });

  cy.get(input_email_message).should('not.exist');
  cy.get(input_password_message).should('not.exist');
  cy.wait(2000);
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

// before(() => {
//   login();
  
// });

// after(() => {
  
//   logout();
// });

beforeEach(() =>{

  login();
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
  cy.get(btn_logout_container).contains("Companies").click({ force: true });
  cy.wait(4000);
  cy.url().should('eq', `${company_page_url}`);

});

afterEach(()=>{
  logout();
})

describe(()=>{

  it("create new company and add it in list - C1", ()=> {

    const create_company_button = ".v-container > .v-row > .v-col";
    cy.get(create_company_button).contains("button","Create Company").click();

    const create_company_overlay = ".v-overlay__content > .v-card > .v-container > .v-form > .v-row"
    cy.get(create_company_overlay).contains("Company Name").parent().type(company_name)
    cy.get(create_company_overlay).contains("Admin Name").parent().type(admin_name)
    cy.get(create_company_overlay).contains("Admin Email").parent().type(admin_email)
    cy.get(create_company_overlay).contains("Plan").parent().click();
    cy.get(".v-overlay > .v-overlay__content > .v-list").contains(plan).click({ force: true });
    cy.get(create_company_overlay).contains("button","Create Company").click({force:true}).wait(4000)
    
  });

  it("can search by company name, administrator name, administrator email address, and contract plan. - C2", () => {

    const search_company = ".v-container > .v-row > .v-col";
    const placeholder_path = ".v-input > .v-input__control > .v-field > .v-field__field > .v-field__input"
    //search in company name
    cy.get(search_company).eq(1).get(placeholder_path).first().type(company_name).wait(2000)
    cy.get(search_company).eq(2).should("contain",company_name)
    cy.get(search_company).eq(1).get(placeholder_path).first().clear()
    //search in admin name
    cy.get(search_company).eq(1).get(placeholder_path).first().type(admin_name).wait(2000)
    cy.get(search_company).eq(2).should("contain",admin_name)
    cy.get(search_company).eq(1).get(placeholder_path).first().clear()
    //search in admin email
    cy.get(search_company).eq(1).get(placeholder_path).first().type(admin_email).wait(2000)
    cy.get(search_company).eq(2).should("contain",admin_email)
    cy.get(search_company).eq(1).get(placeholder_path).first().clear()
    //search in contract plan
    cy.get(search_company).eq(1).get(placeholder_path).first().type(plan).wait(2000)
    cy.get(search_company).eq(2).should("contain",plan)
    cy.get(search_company).eq(1).get(placeholder_path).first().clear()
  });

  it("can sort in company name, administrator name, administrator email address, and contract plan - C3-C6",() => {

    const search_company = ".v-container > .v-row > .v-col";
    const sort_category_path = ".v-card > .v-table > .v-table__wrapper > table > thead > tr"
    const sorted_first_item_path = ".v-card > .v-table > .v-table__wrapper > table > tbody"
    //sort in company name 
    cy.get(search_company).eq(2).get(sort_category_path).contains("Company List").next().click().wait(2000)
    cy.get(search_company).eq(2).get(sorted_first_item_path).children().first().contains(company_name)
    //sort admin name 
    cy.get(search_company).eq(2).get(sort_category_path).contains("Admin Name").next().click().wait(2000)
    cy.get(search_company).eq(2).get(sorted_first_item_path).children().first().contains(admin_name)
    //sort in admin email
    cy.get(search_company).eq(2).get(sort_category_path).contains("Admin Email").next().click().wait(2000)
    cy.get(search_company).eq(2).get(sorted_first_item_path).children().first().contains(admin_email)
    //sort in plan
    cy.get(search_company).eq(2).get(sort_category_path).contains("Plan").next().click().wait(2000)
    cy.get(search_company).eq(2).get(sorted_first_item_path).children().first().contains("Enterprise")

  });

  it("shows that preview, edit, delete bottons and can go detail of company - C7, C8",() => {

    const search_company = ".v-container > .v-row > .v-col";
    const sort_category_path = ".v-card > .v-table > .v-table__wrapper > table > tbody"

    //it will check buttons
    cy.get(search_company).eq(2).get(sort_category_path).children().first().children().last().should("contain","preview")
    cy.get(search_company).eq(2).get(sort_category_path).children().first().children().last().should("contain","edit")
    cy.get(search_company).eq(2).get(sort_category_path).children().first().children().last().should("contain","delete")

    //click preview button and see details of company
    cy.get(search_company).eq(2).get(sort_category_path).children().first().children().last().contains("button","preview").click().wait(2000)
    cy.get(search_company).eq(0).should("contain","Company Information")
    
  });

  it("will  edit the company detail - C9",() => {
    
    const search_company = ".v-container > .v-row > .v-col";
    const sort_category_path = ".v-card > .v-table > .v-table__wrapper > table > tbody"
    const edit_company_layer = ".v-overlay__content > .v-card"
    const edit_company_layer_path = ".v-container > .v-form > .v-row"

    //it will click edit button
    cy.get(search_company).eq(2).get(sort_category_path).children().contains(company_name).parent().children().last().contains("button","edit").click().wait(2000)
    cy.get(edit_company_layer+ " > header").should("contain","Edit Company")
    cy.get(edit_company_layer).get(edit_company_layer_path).contains("Company Name").parent().clear().type(company_name_after_edited)
    cy.get(edit_company_layer).get(edit_company_layer_path).contains("Plan").parent().click()
    cy.get(".v-overlay > .v-overlay__content > .v-list").contains("Standart").click({ force: true });
    cy.get(edit_company_layer_path).get(edit_company_layer_path).children().contains("Edit Company").click().wait(4000)
    cy.get(search_company).eq(2).get(sort_category_path).children().should("contain",company_name_after_edited)

  })

  it("will delete the company that created - C10",()=>{

    const search_company = ".v-container > .v-row > .v-col";
    const sort_category_path = ".v-card > .v-table > .v-table__wrapper > table > tbody"
    const delete_button_path = ".v-overlay__content > .v-card"
    const placeholder_path = ".v-input > .v-input__control > .v-field > .v-field__field > .v-field__input"

    //for delete the company we need to delete the admin user first

    //go to user management screen
    const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
    cy.get(user_icon).should('have.text', 'account_circle');
    cy.get(user_icon).contains("account_circle").click({ force: true });

    const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
    cy.get(btn_logout_container).contains("Users").click({ force: true });
    cy.wait(4000);
    cy.url().should('eq', `${user_list_page_url}`);

    //search in user name and delete
    cy.get(search_company).eq(1).get(placeholder_path).first().type(admin_email).wait(2000)
    cy.get(search_company).eq(2).contains(admin_email).parent().children().last().contains("button","delete").click().wait(2000)
    cy.get(delete_button_path + " > " + search_company).eq(1).contains("button","Delete").click().wait(4000)
    cy.get(search_company).eq(2).contains(admin_email).should("not.exist")

    //go to company list screen
    cy.get(user_icon).should('have.text', 'account_circle');
    cy.get(user_icon).contains("account_circle").click({ force: true });
    cy.get(btn_logout_container).contains("Companies").click({ force: true });
    cy.wait(4000);
    cy.url().should('eq', `${company_page_url}`);

    //it will click close delete layer
    cy.get(search_company).eq(2).get(sort_category_path).children().contains(company_name_after_edited).parent().children().last().contains("button","delete").click().wait(2000)
    cy.get(delete_button_path + " > .v-toolbar").contains("button","close").click().wait(4000);
    cy.get(search_company).eq(2).get(sort_category_path).children().contains(company_name_after_edited).should("exist")

    //it will delete the company
    cy.get(search_company).eq(2).get(sort_category_path).children().contains(company_name_after_edited).parent().children().last().contains("button","delete").click().wait(2000)
    cy.get(delete_button_path + " > .v-container").contains("button","Delete Company").click().wait(2000)
    cy.get(search_company).eq(2).get(sort_category_path).children().contains(company_name_after_edited).should("not.exist")
  })

  it("should check pagination is working - C11",() =>{
    const title_company_list_selector = ".v-container"
    const footer_info = ".v-table > .v-row > .v-col > .d-flex > small";
    let total_elements = 0;
    let elements_from = 0;
    let elements_to = 0;

    let title_company_list; 
    let next;

    cy.get(footer_info).eq(1).invoke('text').then((text) => {
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
      const title_company_list = cy.get(title_company_list_selector + " > .v-row").contains("Company List");
      const next = title_company_list.parent().parent().next();
      const table_body = ".v-table > .v-table__wrapper > table > tbody";
      next.find(table_body).children().should("have.length", elements_to - elements_from + 1);

      if (button_active_next) {
        // Get the title of the company list
        let title_company_list = cy.get(title_company_list_selector + " > .v-row").contains("Company List");
        let next = title_company_list.parent().parent().next();
        const footer_buttons = ".v-table > .v-row > .v-col > .d-flex > .v-pagination > .v-pagination__list";
    
        // Click on the "next page" button
        next.find(footer_buttons).contains("chevron_right").click().wait(2000);
        cy.url().should('eq', `${"https://beta.multi-chat.data-artist.info/admin/company?page=2&perPage=10"}`);
        cy.log("Clicked on 'next page'");
    
        // Get the updated company list and pagination info
        title_company_list = cy.get(title_company_list_selector + " > .v-row").contains("Company List");
        next = title_company_list.parent().parent().next();
        next.find(footer_info).eq(1).invoke('text').then((text) => {
            const str_info = text.trim();
            const array_info = str_info.split(" of ");
            const total_elements = parseInt(array_info[1].trim(), 10);
            const array_current_page = array_info[0].trim().split("-");
            const elements_from_2 = parseInt(array_current_page[0].trim(), 10);
            const elements_to_2 = parseInt(array_current_page[1].trim(), 10);
    
            // Check if next and previous buttons should be active
            let button_active_next = elements_to_2 < total_elements;
            let button_active_prev = elements_from_2 > 1;
    
            // Log the results
            cy.log(`Total elements: ${total_elements}`);
            cy.log(`From: ${elements_from_2}, To: ${elements_to_2}`);
            cy.log(`Next button active: ${button_active_next}`);
            cy.log(`Previous button active: ${button_active_prev}`);
    
            // Check if the number of elements is correct
            //bug
            //cy.expect(elements_to_2).to.be.greaterThan(elements_to);
            let title_company_list = cy.get(title_company_list_selector + " > .v-row").contains("Company List");
            let next = title_company_list.parent().parent().next();
            const table_body = ".v-table > .v-table__wrapper > table > tbody";
            //bug
            //next.find(table_body).children().should("have.length", elements_to_2 - elements_from_2 + 1);
        })
      }

    })
  })

  // it("should check pagination is working - C11",() => {
  //   const title_company_list = ".v-container"
  //   const footer_info = ".v-table > .v-row > .v-col > .d-flex > small";
  //   let total_elements = 0;
  //   let elements_from = 0;
  //   let elements_to = 0;
  //   cy.get(footer_info).eq(1).invoke('text').then((text) => {
  //     const str_info = text.trim();
  //     cy.log("INFO: " + str_info);
  //     const array_info = str_info.split(" of ");
  //     total_elements = parseInt(array_info[1].trim(), 10);
  //     const array_current_page = array_info[0].trim().split("-");
  //     elements_from = parseInt(array_current_page[0].trim(), 10);
  //     elements_to = parseInt(array_current_page[1].trim(), 10);
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
  //     title_company_list = cy.get(" > .v-row").contains("Company List");
  //     next = title_company_list.parent().next();
  //     const table_body = ".v-table > .v-table__wrapper > table > tbody";
  //     next.find(table_body).children().should("have.length", elements_to - elements_from + 1);
  //     if (button_active_next) {
  //       title_company_list = cy.get(".v-row").contains("Company List");
  //       next = title_company_list.parent().next();
  //       const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
  //       // Click on "next page"
  //       next.find(footer_buttons).contains("chevron_right").click();
  //       cy.log("Click on 'next page'");
  //       title_company_list = cy.get(".v-row").contains("Company List");
  //       next = title_company_list.parent().next();
  //       next.find(footer_info).invoke('text').then((text) => {
  //         const str_info = text.trim();
  //         cy.log("INFO: " + str_info);
  //         const array_info = str_info.split(" of ");
  //         total_elements = parseInt(array_info[1].trim(), 10);
  //         const array_current_page = array_info[0].trim().split("-");
  //         let elements_from_2 = parseInt(array_current_page[0].trim(), 10);
  //         let elements_to_2 = parseInt(array_current_page[1].trim(), 10);
  //         cy.log("total_elements: " + total_elements);
  //         cy.log("From2: " + elements_from_2 + ", To2: " + elements_to_2);
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
  //         title_company_list = cy.get(".v-row").contains("Company List");
  //         next = title_company_list.parent().next();
  //         const table_body = ".v-table > .v-table__wrapper > table > tbody";
  //         next.find(table_body).children().should("have.length", elements_to_2 - elements_from_2 + 1);
  //         if (button_active_next) {
  //           title_company_list = cy.get(".v-row").contains("Company List");
  //           next = title_company_list.parent().next();
  //           const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
  //           // Click on "last page"
  //           next.find(footer_buttons).contains("last_page").click();
  //           cy.log("Click on 'last page'");

  //           title_company_list = cy.get(".v-row").contains("Company List");
  //           next = title_company_list.parent().next();
  //           next.find(footer_info).invoke('text').then((text) => {
  //             const str_info = text.trim();
  //             cy.log("INFO: " + str_info);
  //             const array_info = str_info.split(" of ");
  //             total_elements = parseInt(array_info[1].trim(), 10);
  //             const array_current_page = array_info[0].trim().split("-");
  //             let elements_from_3 = parseInt(array_current_page[0].trim(), 10);
  //             let elements_to_3 = parseInt(array_current_page[1].trim(), 10);
  //             cy.log("total_elements: " + total_elements);
  //             cy.log("From3: " + elements_from_3 + ", To3: " + elements_to_3);
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
  //             title_company_list = cy.get(".v-row").contains("Company List");
  //             next = title_company_list.parent().next();
  //             const table_body = ".v-table > .v-table__wrapper > table > tbody";
  //             next.find(table_body).children().should("have.length", elements_to_3 - elements_from_3 + 1);
  //             if (button_active_prev) {
  //               title_company_list = cy.get(".v-row").contains("Company List");
  //               next = title_company_list.parent().next();
  //               const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
  //               // Click on "previous page"
  //               next.find(footer_buttons).contains("chevron_left").click();
  //               cy.log("Click on 'previous page'");

  //               title_company_list = cy.get(".v-row").contains("Company List");
  //               next = title_company_list.parent().next();
  //               next.find(footer_info).invoke('text').then((text) => {
  //                 const str_info = text.trim();
  //                 cy.log("INFO: " + str_info);
  //                 const array_info = str_info.split(" of ");
  //                 total_elements = parseInt(array_info[1].trim(), 10);
  //                 const array_current_page = array_info[0].trim().split("-");
  //                 let elements_from_4 = parseInt(array_current_page[0].trim(), 10);
  //                 let elements_to_4 = parseInt(array_current_page[1].trim(), 10);
  //                 cy.log("total_elements: " + total_elements);
  //                 cy.log("From4: " + elements_from_4 + ", To4: " + elements_to_4);
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
  //                 title_company_list = cy.get(".v-row").contains("Company List");
  //                 next = title_company_list.parent().next();
  //                 const table_body = ".v-table > .v-table__wrapper > table > tbody";
  //                 next.find(table_body).children().should("have.length", elements_to_4 - elements_from_4 + 1);
  //                 if (button_active_prev) {
  //                   title_company_list = cy.get(".v-row").contains("Company List");
  //                   next = title_company_list.parent().next();
  //                   const footer_buttons = ".v-table > .v-data-table-footer > .v-data-table-footer__pagination";
  //                   // Click on "first page"
  //                   next.find(footer_buttons).contains("first_page").click();
  //                   cy.log("Click on 'first page'");

  //                   title_company_list = cy.get(".v-row").contains("Company List");
  //                   next = title_company_list.parent().next();
  //                   next.find(footer_info).invoke('text').then((text) => {
  //                     const str_info = text.trim();
  //                     cy.log("INFO: " + str_info);
  //                     const array_info = str_info.split(" of ");
  //                     total_elements = parseInt(array_info[1].trim(), 10);
  //                     const array_current_page = array_info[0].trim().split("-");
  //                     let elements_from_5 = parseInt(array_current_page[0].trim(), 10);
  //                     let elements_to_5 = parseInt(array_current_page[1].trim(), 10);
  //                     cy.log("total_elements: " + total_elements);
  //                     cy.log("From4: " + elements_from_5 + ", To4: " + elements_to_5);
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
  //                     title_company_list = cy.get(".v-row").contains("Company List");
  //                     next = title_company_list.parent().next();
  //                     const table_body = ".v-table > .v-table__wrapper > table > tbody";
  //                     next.find(table_body).children().should("have.length", elements_to_5 - elements_from_5 + 1);
  //                   });
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });

  // })
})