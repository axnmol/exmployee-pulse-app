# Testing the Employee Pulse Application

This document outlines how to run the automated tests for the backend of the Employee Pulse Application and provides an overview of the test coverage. The following strategy was developed as part of the assessment requirements.

**1. What areas of the app would you test and why?**

Testing efforts will focus on critical user flows and core functionality to ensure reliability, security, and correctness. Key areas include:

- **Authentication (Backend & Frontend):**
  - _Why:_ Security is paramount. Ensure users can register, log in securely, sessions (JWT) are managed correctly, passwords are hashed, and unauthorized access is prevented. Test both employee and admin login flows.
- **Survey Submission (Backend & Frontend):**
  - _Why:_ Core employee feature. Verify that employees can submit responses, data is validated (e.g., non-empty), and responses are correctly associated with the logged-in user.
- **Survey Retrieval (Backend & Frontend):**
  - _Why:_ Core feature for both user types. Ensure employees can only view their own past submissions and that admins can view all submissions accurately. Test data integrity and access control.
- **Data Export (Backend):**
  - _Why:_ Core admin feature. Verify that the export functions generate valid CSV and JSON files containing the correct data and that only admins can trigger exports. Test file structure and data accuracy.
- **API Endpoints (Backend):**
  - _Why:_ Ensure API contracts are met, including request validation (DTOs), response formats, status codes, and error handling for various scenarios (e.g., bad input, not found, unauthorized).
- **Role-Based Access Control (Backend & Frontend):**
  - _Why:_ Ensure employees cannot access admin functionality and that admin routes/components are properly restricted.
- **User Interface (Frontend):**
  - _Why:_ Ensure usability and correctness. Test form submissions, data display, navigation, and handling of loading/error states.

**2. Types of tests you would write (unit, integration, end-to-end).**

A balanced testing approach involves different levels of testing:

- **Unit Tests:**

  - _Focus:_ Individual functions, methods, or components in isolation.
  - _Backend (NestJS):_ Test specific methods within services (e.g., `AuthService.validateUser`, `UsersService.create` hashing logic, `SurveysService` data transformations) by mocking dependencies (like Mongoose models, other services). Test utility functions or guards in isolation. Frameworks: Jest (comes with NestJS).
  - _Frontend (React):_ Test individual components (e.g., `SurveyForm` validation logic, `PastSubmissionsList` rendering based on props) by mocking props, context (`useAuth`), and API calls. Frameworks: Jest + React Testing Library (common with Vite/CRA).
  - _Goal:_ Verify the correctness of small, isolated pieces of logic quickly.

- **Integration Tests:**

  - _Focus:_ Interactions between multiple components or layers within a single part of the stack (backend or frontend), or between the application and external services (like the database).
  - _Backend (NestJS):_ Test controllers interacting with services, or services interacting with the database. For example, test the `/auth/login` endpoint flow from controller -> guard -> strategy -> service, potentially hitting a test database. Test Mongoose schema validation and model interactions. Frameworks: Jest + Supertest (for HTTP endpoint testing, often used in NestJS E2E setup).
  - _Frontend (React):_ Test interactions between parent/child components, context updates, or components making actual (mocked or real in specific setups) API calls and updating state based on the response. Frameworks: Jest + React Testing Library.
  - _Goal:_ Ensure that different parts within the backend _or_ frontend work together as expected, including interactions with infrastructure like the database.

- **End-to-End (E2E) Tests:**
  - _Focus:_ Simulating complete user scenarios across the entire application stack (frontend -> backend -> database).
  - _Implementation:_ Use browser automation tools to interact with the deployed frontend UI (running against a live or test backend). Scenarios would include: Register -> Login -> Submit Survey -> View History; Admin Login -> View Submissions -> Export Data.
  - _Frameworks:_ Cypress, Playwright.
  - _Goal:_ Verify that complete user flows work correctly from the user's perspective, ensuring all parts of the application are integrated properly. These are typically slower and more brittle but provide high confidence in user journeys.

**3. Sample test cases (write at least 10).**

- **Backend - Unit Tests (Jest):**

  1. `UsersService.create`: Should correctly hash the password using bcrypt before saving the user. (Mock `bcrypt.hash` and `userModel.save`).
  2. `AuthService.validateUser`: Should return the user object (without hash) for valid credentials. (Mock `UsersService.findByEmail` and `bcrypt.compare`).
  3. `AuthService.validateUser`: Should return `null` for invalid passwords. (Mock `UsersService.findByEmail` and `bcrypt.compare` to return false).
  4. `JwtStrategy.validate`: Should return the correct user payload (`{ userId, email, role }`) given a valid decoded JWT payload.
  5. `RolesGuard.canActivate`: Should return `true` if no roles are required for the route. (Mock `Reflector`).
  6. `RolesGuard.canActivate`: Should return `true` if the user's role (from request) matches one of the required roles. (Mock `Reflector` and context/request).
  7. `RolesGuard.canActivate`: Should return `false` if the user's role does not match the required roles. (Mock `Reflector` and context/request).

- **Backend - Integration Tests (Jest + Supertest):** 8. `POST /auth/register`: Should return `201 Created` and user data (without hash) for valid registration data. (Requires DB connection). 9. `POST /auth/register`: Should return `409 Conflict` if attempting to register with an existing email. (Requires DB connection). 10. `POST /auth/login`: Should return `200 OK` and a JWT `access_token` for valid credentials. (Requires DB connection with a seeded user). 11. `POST /surveys`: Should return `401 Unauthorized` if no valid JWT is provided. 12. `POST /surveys`: Should return `201 Created` and the survey data when a logged-in user submits a valid response. (Requires DB connection + JWT). 13. `GET /surveys/all`: Should return `403 Forbidden` (or similar based on guard) if accessed by a user with the 'employee' role. (Requires DB connection + Employee JWT). 14. `GET /surveys/all`: Should return `200 OK` and an array of surveys if accessed by a user with the 'admin' role. (Requires DB connection + Admin JWT).

- **Frontend - Component Tests (React Testing Library):** 15. `LoginForm`: Should display an error message if the login API call fails with a 401 status. (Mock `axios.post`). 16. `SurveyForm`: Should disable the submit button while the submission API call is in progress. (Check button's `disabled` attribute).

- **E2E Tests (Cypress/Playwright):** 17. _Employee Flow:_ User can register, log in, navigate to the 'Take Survey' page, submit a response, navigate to 'View History', and see the submitted response listed. 18. _Admin Flow:_ Admin user can log in, navigate to the admin dashboard, view the table of all submissions (including the one submitted by the employee in the previous test), and successfully trigger a CSV export download.

**4. How you would maintain test quality and automation over time.**

Maintaining test quality and ensuring tests remain valuable requires ongoing effort and process:

- **Automation:** All unit and integration tests will be automated using testing frameworks (Jest, React Testing Library, Supertest). E2E tests will also be automated (Cypress/Playwright). Tests should be runnable with a single command (e.g., `npm test`, `npm run test:e2e`).
- **CI/CD Integration:** Integrate automated tests into a Continuous Integration/Continuous Deployment (CI/CD) pipeline (e.g., using GitHub Actions, GitLab CI, Jenkins). Builds or deployments should fail if any tests fail, preventing regressions from reaching production.
- **Code Reviews:** Test code should be treated like production code. New tests and changes to existing tests should be included in pull requests and reviewed by peers to ensure correctness, readability, and relevance. Ensure new features include corresponding tests.
- **Coverage Monitoring:** Track test coverage (e.g., using Jest's built-in coverage reporting or tools like Codecov/Coveralls). While aiming for high coverage is good, focus should be on testing critical paths and logic effectively, not just achieving a percentage. Regularly review coverage reports to identify untested areas.
- **Regular Refactoring:** Just like production code, test code needs refactoring. Keep tests DRY (Don't Repeat Yourself), readable, and maintainable. Remove redundant or flaky tests. Update tests when underlying code or requirements change.
- **Test Data Management:** For integration and E2E tests relying on a database, establish a clear strategy for managing test data (e.g., seeding data before tests, cleaning up afterwards, using dedicated test databases).
- **Flake Detection and Fixing:** Actively monitor tests (especially E2E) for flakiness (tests that pass sometimes and fail others without code changes). Prioritize fixing flaky tests, as they erode confidence in the test suite.

## Overview

The primary tests included are end-to-end (e2e) tests for the NestJS backend API, located in the `pulse-app-backend/test/` directory. These tests use `supertest` to simulate HTTP requests against the running application instance and Jest as the test runner and assertion library.

These e2e tests verify the core API flows, including authentication and survey submissions, interacting with the application modules and the in-memory data store.

## Prerequisites

- Ensure Node.js and npm are installed.
- Install backend dependencies by running `npm install` within the `pulse-app-backend` directory.

## Running Tests

All test commands should be run from the `pulse-app-backend` directory.

```bash
cd pulse-app-backend
```

### Running All End-to-End Tests

To execute all e2e test specifications (`*.e2e-spec.ts`) found in the `test` directory:

```bash
npm run test:e2e
```

This command compiles the application and runs the test suite defined in `jest-e2e.json`.

### Running a Specific Test File

If you need to run only a specific test file (e.g., `app.e2e-spec.ts`):

```bash
npx jest test/app.e2e-spec.ts
```

Replace `test/app.e2e-spec.ts` with the actual path to the file if needed.

### Other Potential Test Scripts

Check the `scripts` section in `pulse-app-backend/package.json` for other potential test commands, such as:

- `npm run test`: Might run unit tests (`*.spec.ts`).
- `npm run test:watch`: Might run tests in watch mode.

## Test Coverage Overview (`app.e2e-spec.ts`)

The main e2e test file (`app.e2e-spec.ts`) covers the following scenarios:

- **Default Endpoint:**
  - Checks if the root endpoint (`/`) returns the expected "Hello World!".
- **Authentication Flow (`/auth/...`):**
  - Successful user registration.
  - Failure to register a duplicate user (expects 409 Conflict).
  - Successful login with correct credentials (expects 200 OK and a JWT).
  - Failed login with incorrect password (expects 401 Unauthorized).
  - Successfully retrieving user profile using a valid JWT.
  - Failure to retrieve user profile without a JWT (expects 401 Unauthorized).
- **Survey Flow (Employee Role - `/surveys/...`):**
  - Successfully submitting a survey response with a valid JWT.
  - Failure to submit a survey with an empty response (expects 400 Bad Request).
  - Successfully retrieving the user's own submitted surveys.
  - Failure for an employee to retrieve all surveys (`/surveys/all`) (expects 403 Forbidden).

## Important Considerations

- **In-Memory Data Store:** The tests run against the application using its in-memory data storage. This means:
  - Data **persists between tests within the same run**. For example, a user registered in one test will exist for subsequent tests in that run.
  - Tests are written assuming this sequential execution and state persistence (e.g., login tests assume the user was created in a prior registration test).
  - All data is **lost** when the test application instance stops (e.g., after the test suite finishes or if the process is manually stopped).
- **Test Data:** Tests often use dynamically generated data (like emails with timestamps) to minimize collisions between separate full runs of the test suite, but state persistence _within_ a single run is still a factor.

## Future Testing (Areas for Expansion)

- **Frontend Tests:** Implement frontend component and/or e2e tests using libraries like React Testing Library, Jest (with JSDOM), or Cypress.
- **Backend Unit/Integration Tests:** Add more granular unit tests for services and controllers, potentially mocking dependencies.
