const input_email = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_password = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__control > .v-field > .v-field__field > .v-field__input";
const input_email_message = ".v-form > .v-row > :nth-child(3) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const input_password_message = ".v-form > .v-row > :nth-child(4) > .v-input > .v-input__details > .v-messages > .v-messages__message";
const btn_login = '.v-form > .v-row > :nth-child(6) > .v-btn';

const base_url = Cypress.env('host');
const request_page_url = "https://beta.multi-chat.data-artist.info/admin/request"
const new_company_creation_page_url = "https://beta.multi-chat.data-artist.info/auth/signup"
const company_details = ".v-col > .v-input > .v-input__control > .v-field > .v-field__field > .v-label"
const company_create_page = ".v-card > .v-form > .v-row"
const overlay_back_to_login_page = ".v-overlay > .v-overlay__content > .v-card"

const current_email = Cypress.env('email_system_admin');
const current_password = Cypress.env('password_systet_admin');

before(() => {
  login();
  
});

// beforeEach(() =>{

//   login_as_system_admin();
//   const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
//   cy.get(user_icon).should('have.text', 'account_circle');
//   cy.get(user_icon).contains("account_circle").click({ force: true });

//   cy.wait(100);

//   const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
//   cy.get(btn_logout_container).contains("Requests").click({ force: true });
//   cy.wait(4000);
//   cy.url().should('eq', `${request_page_url}`);

// });

// afterEach(()=>{
//   logout();
// })


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

const login = () => {
  it("visit web site log in page", () => {
    cy.visit(base_url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('onboarding', 'false')
      },
    });
    cy.wait(4000);

    // Language to ENGLISH
    cy.get('[aria-haspopup="menu"] > .v-btn__content').click({ force: true });
    cy.get('.v-list > :nth-child(1)').click({ force: true });

    cy.wait(2000);
  });
};

describe("it will do new company registration", () => {

  it("visit web site new company creation page and do registrarion - N1,2,3,4", () => {
    cy.get('.v-form > .v-row').contains('New Company Registration Application').click();
    cy.url().should('eq', `${new_company_creation_page_url}`);
    cy.wait(2000)
    cy.get(company_details).contains("Company Name").parent().type('Cypress_test_company');
    cy.get(company_details).contains("Department Name").parent().type('default');
    cy.get(company_details).contains("Username").parent().type('Company_boss');
    cy.get(company_details).contains("Email").parent().type('testacctestproject@gmail.com');
    cy.get(company_details).contains("Phone").parent().type('25252525');
    cy.get(company_details).contains("Occupation").parent().type('engineer');
    cy.get(company_details).contains("Subscription plan").parent().click()
    //cy.get(".v-overlay > .v-overlay__content > .v-list").contains('Standart').click({ force: true });
    cy.get(".v-overlay > .v-overlay__content > .v-list").children().eq(1).click()
    cy.get('input[type="checkbox"][id="checkbox-26"]').check();
    cy.get(company_create_page).contains('button','Sign in').click()

    //over the registration and go back login page - N4
    cy.get(overlay_back_to_login_page).contains('We have accepted your request for registration.')
    cy.get(overlay_back_to_login_page).contains('We will check the status of your company registration internally and contact by email.')
    cy.get(overlay_back_to_login_page).contains('button','Back to login').click()
    cy.url().should('eq', `${base_url}/auth/login`);
  });

  it("login as system admin and check the company create request", () => {

  login_as_system_admin();

  //go requests page 
  const user_icon = ".v-toolbar > .v-toolbar__content > .v-container > :nth-child(6).v-btn > .v-btn__content > i";
  cy.get(user_icon).should('have.text', 'account_circle');
  cy.get(user_icon).contains("account_circle").click({ force: true });

  cy.wait(100);

  const btn_logout_container = ".v-overlay-container > .v-overlay > .v-overlay__content > .v-list";
  cy.get(btn_logout_container).contains("Requests").click({ force: true });
  cy.wait(4000);
  cy.url().should('eq', `${request_page_url}?page=1&perPage=10`);

  //check in new request have our request
  const new_registarion_request = ".v-container > .v-row > .v-col > .v-slide-group .v-slide-group__container > .v-slide-group__content"
  cy.get(new_registarion_request).contains("Plan Change Request ").click().wait(2000)
  cy.get(new_registarion_request).contains("New Registration Request ").click().wait(2000).should('have.attr', 'aria-selected', 'true');

  const search_request = ".v-container > .v-row > .v-col";
  const placeholder_path = ".v-input > .v-input__control > .v-field > .v-field__field > .v-field__input"
  const delete_button_path = ".v-overlay__content > .v-card"
  //search in company name
  cy.get(search_request).eq(1).get(placeholder_path).first().type('Cypress_test_company').wait(2000)
  cy.get(search_request).eq(1).contains('Cypress_test_company').parent().children().last().contains("button","delete").click().wait(2000)
  cy.get(delete_button_path + " > " + search_request).eq(1).contains("button","Delete").click().wait(4000)
  cy.get(search_request).eq(1).contains('Cypress_test_company').should("not.exist")

  })
});
