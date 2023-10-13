const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const company_page_url = "https://beta.multi-chat.data-artist.info/admin/company"
const user_list_page_url = "https://beta.multi-chat.data-artist.info/admin/user-management"
const request_page_url = "https://beta.multi-chat.data-artist.info/admin/request"
const current_email = Cypress.env('email_admin');
const current_password = Cypress.env('password_admin');
const system_admin_email = Cypress.env('email_system_admin');
const system_admin_password = Cypress.env('password_system_admin');

const company_name = "DDAM";
const company_name_after_edited = "0_Cypress_test_edited"
const admin_name = "0_Cypress_test_company_admin";
const department_name = "0_Cypress_test_department"
const admin_email = "cypresss079@gmail.com";
const contract_plan = "Enterprise";
const number_of_users = "90";
const new_department = "cypress_department";
const edited_department = "cypress_edited_department"

Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});

function checkText(DOM_element, value) {
  cy.get(DOM_element).children().first().then(($el) => {
    if ($el.text().includes(value)) {
      cy.wait(1000);
      checkText(DOM_element, value); // Call the function again if the text includes "value"
    }
  });
}

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

const login_as_system_admin = () => {
  cy.visit(base_url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('onboarding', 'false')
    },
  });
  cy.wait(4000);

  // Language to ENGLISH
  cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
  cy.get('.v-list > :nth-child(1)').click({ force: true });

  cy.get(input_email).find("input").type(system_admin_email,{ force: true });
  cy.get(input_password).find("input").type(system_admin_password,{ force: true });
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

// before(() => {
//   login();
  
// });

// after(() => {
  
//   logout();
// });

before(() =>{

  login();
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
  cy.get(btn_logout_container).contains("Company").click({ force: true }).wait(4000);
  cy.url({decode: true}).should('contain', `${company_page_url}`);
  
  checkText(".v-container > .v-row", "Project");
  
});

// after(()=>{
//   logout();
// })

// it("will show company name, count of users, contract plan, usage - Co1,2,3,9",() => {
//   const group_title = ".v-container > .v-row"
//   cy.get(group_title).children().first().contains("Company Information")
//   cy.get(group_title).contains("Company Name").parent().children().should("contain",company_name)
//   cy.get(group_title).contains("User").parent().children().eq(1).invoke('text').then((text) => {
//     cy.log("User count: " + text)
//   })
//   cy.get(group_title).contains("Contract Plan").parent().children().should("contain",contract_plan)
//   const usage_for_month =  cy.get(group_title).contains("Usage for this Month").parent().children().eq(1)
//   let next = usage_for_month.contains("Number of chat").parent().children().eq(1).invoke('text')
//   next.then((text) => {
//     cy.log("Number of chat: " + text)
//   })
//   cy.get(group_title).contains("Usage for this Month").parent().children().eq(1).contains("Data traffic").parent().children().eq(1).invoke('text').then((text) => {
//     cy.log("Data traffic: " + text)
//   })
// })

// it("will send requist of change contract plan - Co4,5,6,7",() => {

//   const group_title = ".v-container > .v-row"
//   const overlay_plan_change = ".v-overlay__content > .v-card"

//   cy.get(group_title).contains("Contract Plan").parents().eq(4).contains("Change").click().wait(1000)
//   cy.get(overlay_plan_change + " > .v-toolbar").contains("Plan Change Request").should("exist")
//   cy.get(overlay_plan_change + " > .v-container > .v-row").children().first().contains("Monthly")
// // it not sending request in while after all change to send 
//   cy.get(overlay_plan_change + " > .v-container > .v-row").children().contains("Free tier").parents().eq(2).contains("Request").should("exist")
// })

// it("will check change contract plan sent to system admin",() =>{

//   login_as_system_admin();

//   //go requests page 
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(100);

//   const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
//   cy.get(btn_logout_container).contains("Requests").click({ force: true }).wait(4000);
//   cy.url({decode: true}).should('contain', `${request_page_url}`);

//   //check in new request have our request
//   const new_registarion_request = ".v-container > .v-row > .v-col > .v-slide-group .v-slide-group__container > .v-slide-group__content"
//   cy.get(new_registarion_request).contains("Plan Change Request ").click().wait(2000).should('have.attr', 'aria-selected', 'true');

//   const search_request = ".v-container > .v-row > .v-col";
//   const placeholder_path = ".v-input > .v-input__control > .v-field > .v-field__field > .v-field__input"
//   const delete_button_path = ".v-overlay__content > .v-card"
//   //search in company name
//   cy.get(search_request).eq(1).get(placeholder_path).find("input").first().type(company_name,{ force: true }).wait(2000)
//   cy.get(search_request).eq(1).contains(company_name).first().parent().children().last().contains("button","delete").click().wait(2000)
//   //change a while
//   cy.get(delete_button_path + " > " + search_request).eq(1).contains("button","Delete").click().wait(4000)
//   cy.get(search_request).eq(1).contains(company_name).first().should("not.exist")
// })

// it("check department list and action buttons Co10-14",() =>{

//   const group_title = ".v-container > .v-row > .v-col"
//   const overlay_department = ".v-overlay__content > .v-card"
//   const overlay_subtile_path = ".v-col > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input"
//   const table_path = ".v-card > .v-table > .v-table__wrapper > table > tbody"

//   //create department
//   cy.get(group_title).contains("Create Department").click().wait(2000)
//   cy.get(overlay_department).find("header").contains("Create Department").should("exist")
//   cy.get(overlay_department).find(".v-container").contains("Please enter your department name?").parent().type(new_department)
//   cy.get(overlay_department).find(".v-container").contains("Create").click().wait(4000)

//   //view Department details
//   cy.get(group_title).find(table_path).children().contains(new_department).parent().siblings().last().contains("preview").click()
//   cy.get(overlay_department).find(".v-toolbar").contains("Department Details").should("exist")
//   cy.get(overlay_department).find(".v-container").contains("Department Name").parent().find(overlay_subtile_path).find("input").should("exist")
//   cy.get(overlay_department).find(".v-container").contains("Number of Users").parent().find(overlay_subtile_path).find("input").should("exist")
//   cy.get(overlay_department).find(".v-container > .v-row").children().find(overlay_subtile_path).find("input").should("exist")
//   cy.get(overlay_department).find(".v-container").find(".v-table > .v-table__wrapper").should("exist")
//   cy.get(overlay_department).find(".v-toolbar").contains("close").click()

//   //edit Department
//   cy.get(group_title).find(table_path).children().contains(new_department).parent().siblings().last().contains("edit").click()
//   cy.get(overlay_department).find("header").contains("Edit Department").should("be.visible")
//   cy.get(overlay_department).find(".v-container").contains("Please enter your department name?").parent().clear().type(edited_department)
//   cy.get(overlay_department).find(".v-container").contains("Edit").click().wait(4000)

//   //delete Department
//   cy.get(group_title).find(table_path).children().contains(edited_department).parent().siblings().last().contains("delete").click()
//   cy.get(overlay_department + " > " + group_title).eq(1).contains("button","Delete").click().wait(4000)
//   cy.get(group_title).eq(2).contains(edited_department).should("not.exist")
  
// })

it("Pagination",()=>{

  
})