# Cypress Test Readme

This readme file provides a step-by-step guide on how to run the Cypress test file.

## Prerequisites

Before running the Cypress test, ensure that you have the following installed:

- Node.js (version >= 10)
- npm (Node Package Manager)

## Installation

1. Clone the repository to your local machine:

```
git clone https://gitlab.ddam.ai/chatbot_ddam/mugenai-cypress.git
```

2. Navigate to the project directory:

```
cd ./test_cypress
```

3. Install the project dependencies:

```
npm install
```

## Running the Test

To run the Cypress test, follow these steps:

1. Open the Cypress Test Runner:

```
npx cypress open
```

2. The Cypress Test Runner will open, displaying a list of available test files. Click on the "e2e" folder to expand it.

3. Click on the desired test file to run it.

4. In the Cypress Test Runner, click on the "Chrome" browser option to select it.

5. Click on the "Run 1 integration spec" button to start the e2e testing in Chrome.

6. The test file will execute in the Cypress Test Runner, and the results will be displayed in the test runner window.

## Running a Specific Spec File

To run a specific spec file without using the Cypress Test Runner, use the following command:

```
npx cypress run --spec cypress/e2e/05.notification.cy.js
```

This command will run the specified spec file in headless mode, and the test results will be displayed in the console.

This command will run the specified spec file in headless mode, and the test results will be displayed in the console.

1. Run only one file:
   ```
   npx cypress run --spec ./cypress/e2e/05.notification.cy.js
   ```
   This command runs only the specified file `05.notification.cy.js` in the `./cypress/e2e/` directory.

2. Run category files:
   ```
   npx cypress run --spec ./cypress/e2e/08.*
   ```
   This command runs all the files in the `./cypress/e2e/` directory that start with `08.`.

3. Run a few category files:
   ```
   npx cypress run --spec './cypress/e2e/**/(05.*|09.*|10.*|11.*).js'
   ```
   This command runs the files in the `./cypress/e2e/` directory that match the patterns `05.*`, `09.*`, `10.*`, or `11.*`.

4. Run all files except specific files:
   ```
   npx cypress run --spec './cypress/e2e/**/!(05.*|09.*|10.*|11.*).js'
   ```
   This command runs all the files in the `./cypress/e2e/` directory except the ones that match the patterns `05.*`, `09.*`, `10.*`, or `11.*`.

5. Run but output not containing video:
   ```
   npx cypress run --spec ./cypress/e2e/08.* --config video=false
   ```
   This command runs all the files in the `./cypress/e2e/` directory that start with `08.`, but disables the video recording in the output.

These examples demonstrate various scenarios for running Cypress tests on macOS. You can modify them based on your specific requirements and adjust the file paths accordingly.

## Running Tests in Parallel

To run Cypress tests in parallel, you can use the `cypress-parallel` package. Here's an example command to achieve this:

```
npm run cy:parallel
```

This command will run the tests in the `cypress/e2e` directory that start with `10.` using 3 parallel processes. Adjust the number of parallel processes and the test directory pattern according to your requirements.

## Writing Tests

To write new tests or modify existing ones, navigate to the `cypress/integration` directory. Here, you will find the test files with the `.spec.js` extension. You can use any text editor to modify these files.

Cypress provides a rich set of APIs to interact with your application under test. Refer to the official Cypress documentation for more details on writing tests.

## Additional Information

- The test results, including screenshots and videos, can be found in the `cypress/results` directory.

- For more advanced configuration options and customizations, refer to the Cypress documentation.

## Troubleshooting

If you encounter any issues while running the Cypress test, try the following steps:

1. Ensure that all dependencies are installed correctly by running `npm install` again.

2. Verify that your test environment is set up correctly and accessible.

If the issue persists, refer to the Cypress documentation or seek assistance from the Cypress community.