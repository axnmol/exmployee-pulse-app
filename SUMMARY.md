# Project Development Summary: Employee Pulse Application

## 1. Project Goal & Initial Scope

The objective was to build a Proof of Concept (POC) for an Employee Pulse application. The core requirements included:

- User registration and authentication (distinguishing between Employees and Admins).
- Employees can submit a simple weekly survey response.
- Employees can view their own submission history.
- Admins can view all submissions.
- Admins can export submissions.

## 2. Initial Technology Choices & Setup

- **Backend:** NestJS (TypeScript) was chosen for its structured approach, modularity, and built-in features suitable for robust API development. Initial setup included modules for Users, Authentication (Auth), and Surveys. MongoDB (via Mongoose) was initially selected for data persistence. JWT (`@nestjs/jwt`) for authentication was configured directly within the `AuthModule` (using a default or hardcoded secret for the POC, removing the need for a separate `.env` file for this specific variable in the simplified version).
- **Frontend:** React (TypeScript) with Vite was selected for its fast development experience and component-based architecture. React Router was used for client-side routing. Axios was chosen for API communication.

## 3. Core Feature Development (Initial Phase)

- **User Management:** Implemented basic user creation (registration) and lookup using Mongoose schemas and services.
- **Authentication:** Set up local strategy (email/password) for login and JWT strategy for protecting routes. Implemented `AuthGuard`s (`LocalAuthGuard`, `JwtAuthGuard`). Hashed passwords using `bcrypt` (handled by Mongoose schema options initially).
- **Role-Based Access Control (RBAC):** Introduced `Role` enum and implemented `RolesGuard` to restrict access to specific endpoints based on user roles (e.g., `/surveys/all` for Admins only).
- **Surveys:** Implemented basic survey submission logic (saving response associated with userId) and endpoints for retrieving employee-specific history and all submissions (admin).

## 4. Key Technical Pivot: Database Strategy (MongoDB -> In-Memory)

- **Challenge:** During development, a `MongooseServerSelectionError` occurred, indicating issues connecting to the configured MongoDB instance.
- **Decision:** To proceed quickly with the POC without requiring external database setup/troubleshooting, a **strategic decision** was made to **pivot away from MongoDB** and implement an **in-memory data store** for the backend.
- **Trade-offs:**
  - _Pros:_ Simplified setup, faster iteration for the POC, eliminated external dependency.
  - _Cons:_ **Data is not persistent.** All registered users (except hardcoded ones) and survey data are lost upon backend server restart. Not suitable for production.

## 5. Backend Refactoring (Post-Pivot)

This pivot required significant backend refactoring:

- **Dependency Removal:** Uninstalled `mongoose` and `@nestjs/mongoose` packages.
- **Dependency Addition:** Installed `uuid` (for generating unique IDs) and `bcrypt` directly (along with `@types/bcrypt`) as Mongoose was no longer handling password hashing.
- **In-Memory Stores:** Created simple arrays within services (`UsersService`, `SurveysService`) to hold user and survey objects.
- **Service Logic:** Rewrote data access logic in services to use array methods (`.find`, `.push`, `.filter`, etc.) instead of Mongoose model methods (`.create`, `.findOne`, `.find`, `.save`, etc.).
- **Data Structures:** Defined simple TypeScript `interface`s for `User` and `Survey` within the services.
- **Password Hashing:** Explicitly integrated `bcrypt.hash` during user creation and `bcrypt.compare` during login validation within `UsersService` and `AuthService`.
- **Hardcoded Admin:** Added logic to `UsersService` to pre-populate the in-memory user store with a hardcoded admin user (`admin@test.com`) with a pre-hashed password.
- **Guard Resolution:** Debugged and resolved issues related to `JwtAuthGuard` import paths or potential compilation caching problems that arose during the refactor.

## 6. Frontend Development & Refinement

### 6.1. Initial Setup & Structure

- Basic routing setup in `App.tsx` using `react-router-dom`.
- Implementation of `AuthContext` for managing authentication state (token, user details) and providing `login`/`logout` functions.
- Creation of `ProtectedRoute` component leveraging `AuthContext` and `react-router-dom` to guard routes based on authentication status and roles.

### 6.2. Component Extraction & Organization

- **Challenge:** `App.tsx` initially contained inline definitions for multiple pages/layouts, making it large and hard to manage.
- **Solution:** Extracted distinct page/layout components into separate files within a `src/pages/` directory (`LoginPage`, `RegisterPage`, `EmployeeDashboardLayout`, `AdminDashboard`, `EmployeeHome`, `TakeSurveyPage`, `HistoryPage`, `NotFoundPage`). Updated `App.tsx` to handle routing and import these components.
- **Benefit:** Improved code organization, maintainability, and reusability.

### 6.3. Styling and Theming

- **Approach:** Primarily used CSS Modules (`*.module.css`) for component-scoped styles (e.g., `common.module.css`, `EmployeeDashboardLayout.module.css`) combined with global styles in `App.css`.
- **Dark Theme:** Initially implemented a dark theme.
- **Light Pastel Theme:** Switched to a light pastel theme based on user feedback, updating colors for backgrounds, text, buttons, inputs, tables, etc.
- **Frosted Glass Effect:** Implemented a macOS-style blur effect using `background-color: rgba(...)` and `backdrop-filter: blur(...)` on main containers (`.App`, `.container`).
- **Typography:** Experimented with various fonts (Pacifico, Cedarville Cursive, Comic Neue, Indie Flower) via Google Fonts, encountered loading/rendering challenges, and ultimately reverted to standard system fonts while styling the main `h1` specifically.
- **Consistency:** Focused on applying common styles (`commonStyles.input`, `commonStyles.button`, `commonStyles.container`) for a consistent look and feel. Removed default browser focus outlines (`outline: none`) on inputs for aesthetic reasons (noting accessibility considerations).

### 6.4. UI/UX Enhancements

- **User Feedback:** Integrated `react-hot-toast` to provide clear feedback for asynchronous operations like login, registration, survey submission, and data export (loading, success, error states).
- **Layout Adjustments:**
  - Used Flexbox extensively for centering content (`App.css`), arranging header elements horizontally (`AdminDashboard`, `EmployeeDashboardLayout`), and vertical stacking.
  - Refined container dimensions (`max-width`, `width`) for better responsiveness.
  - Implemented vertical scrolling within specific content areas (`AdminSubmissionsTable` in AdminDashboard, `PastSubmissionsList` content in EmployeeDashboard) using Flexbox (`flex-grow`, `minHeight: 0`, `overflowY: auto`) to keep headers/navigation fixed.
- **Component-Specific Improvements:**
  - `ExportButtons`: Arranged heading and buttons in a row using Flexbox.
  - `EmployeeDashboardLayout`: Reworked simple links into a tab-like navigation toggle group using `NavLink` and custom CSS Module styles, refining the look based on feedback (connected borders -> distinct buttons -> Shadcn/ui inspiration -> final blue active state). Addressed specificity issues to ensure correct active state styling (`color`, `text-decoration`).
  - `SurveyForm`: Styled `textarea` consistently with other inputs, centered submit button.
  - `PastSubmissionsList`: Implemented fixed heading with scrollable table content below.

### 6.5. Debugging Frontend Issues

- **Admin Login Redirect:** Diagnosed and fixed issue where admin was redirected to `/employee`. Root cause was the `AuthContext` not fetching user profile data (including role) immediately after receiving the login token. Refactored `AuthContext`'s `login` function to handle profile fetching internally.
- **Font Loading/Rendering:** Investigated issues where custom fonts weren't applying correctly, using browser developer tools (Computed Styles, Network tab) to diagnose potential caching, loading failures, or CSS specificity conflicts.
- **Table Scrolling:** Corrected implementation where scrolling styles were initially applied incorrectly within child components instead of the designated parent layout container.
- **Styling Conflicts:** Resolved CSS specificity conflicts (e.g., `.container a` overriding `.activeLink` color) by making component-specific selectors more precise.

## 7. Testing Strategy & Execution

- **Focus:** Primarily focused on backend e2e tests (`pulse-app-backend/test/app.e2e-spec.ts`).
- **Tooling:** Used Jest and `supertest`.
- **Challenge:** Initial e2e tests failed after the pivot to the in-memory store.
- **Solution:** Refactored e2e tests:
  - Adjusted expectations for duplicate user registration (expecting 409).
  - Accounted for state persistence between tests inherent to the in-memory approach (removed redundant user creation steps in login tests).
  - Corrected expected status codes (e.g., 200 for successful login).
- **Documentation:** Created `testing.md` to document test setup, execution, and coverage.

## 8. Documentation

- Updated `README.md` to reflect the current architecture (in-memory store), tech stack, setup instructions, and usage.
- Created `walkthrough.md` providing step-by-step instructions for manual testing of user flows.
- Created `testing.md` detailing automated backend test execution.
- Created this `project_development_summary.md` document (now named `summary.md`).

## 9. Final Application State

The project successfully delivers the core POC requirements:

- Functional registration and role-based login (Employee/Admin).
- Employees can submit surveys and view their history.
- Admins can view all submissions and export them.
- The application uses an in-memory backend store.
- The frontend features a responsive, light pastel theme with interactive elements (tabs, toasts) and appropriate content scrolling.
- Backend e2e tests pass against the in-memory implementation.

## 10. Key Learnings & Takeaways

- **Adaptability:** Demonstrated ability to pivot technical strategy (database choice) based on changing requirements or constraints (POC scope, removing external dependency).
- **Full-Stack Debugging:** Successfully diagnosed and resolved issues spanning both frontend (React state management, routing, styling) and backend (NestJS services, auth, testing).
- **State Management (Frontend):** Understood the importance of correctly sequencing state updates and API calls in context providers (`AuthContext` fix for profile fetching).
- **CSS Specificity & Styling Techniques:** Gained practical experience with CSS Modules, global styles, Flexbox layouts, pseudo-classes (`:hover`, `:focus`), `backdrop-filter`, and debugging specificity conflicts.
- **Testing with State:** Adapted e2e tests to work correctly with an in-memory store, understanding the implications of state persistence between tests.
- **Trade-off Analysis:** Consciously evaluated the pros and cons of using an in-memory store vs. a persistent database for a POC.
