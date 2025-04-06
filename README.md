# Employee Pulse Application

A simple web application allowing employees to submit weekly pulse surveys and admins to view and export submissions.

## Features

- User registration and JWT-based authentication (Login/Logout).
- Role-based access control (Employee vs. Admin).
- Employees can submit a weekly text-based pulse survey response.
- Employees can view their past survey submission history.
- Admins can view all survey submissions from all employees.
- Admins can export all submissions in CSV or JSON format.
- Responsive UI with light pastel theme and frosted glass effects.
- Toast notifications for user feedback.
- Validation, verification and error handling wherever required.

## Tech Stack

- **Backend:**
  - NestJS (Node.js framework)
  - TypeScript
  - JWT for authentication (`@nestjs/jwt`)
  - In-Memory Data Store (using simple arrays/objects)
  - `uuid` for ID generation
  - `bcrypt` for password hashing
  - Class-validator & Class-transformer for DTO validation
- **Frontend:**
  - React
  - Vite build tool
  - TypeScript
  - React Router for navigation
  - Axios for API calls
  - React Hot Toast for notifications
  - CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository (if applicable).
2. Navigate to the backend directory:

   ```bash
   cd pulse-app-backend
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Navigate to the frontend directory:

   ```bash
   cd ../pulse-app-frontend
   # Or from the root: cd pulse-app-frontend
   ```

5. Install frontend dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**

   - Open a terminal in the `pulse-app-backend` directory.
   - Run the development server:

     ```bash
     npm run start:dev
     ```

   - The backend will typically run on `http://localhost:3000`.
   - _(Note: JWT Secret is likely handled internally in this simplified version.)_

2. **Start the Frontend Development Server:**

   - Open a _separate_ terminal in the `pulse-app-frontend` directory.
   - Run the development server:

     ```bash
     npm run dev
     ```

   - The frontend will typically run on `http://localhost:5173` (check terminal output for the exact URL).

3. **Access the Application:**
   - Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

## Usage

1. **Register:** New users can register using the "Register" link on the login page. They will be assigned the "Employee" role by default.
2. **Login:**
   - **Employees:** Log in using registered credentials.
   - **Admin:** Log in using the hardcoded credentials:
     - Email: `admin@test.com`
     - Password: `password123`
3. **Employee Dashboard:** Submit surveys, view history using the tab navigation.
4. **Admin Dashboard:** View all submissions, export data.

_For detailed steps, see `walkthrough.md`._

## Important Note: Data Persistence

This application currently uses an **in-memory data store** for the backend. **All registered users (except the hardcoded admin) and survey submissions will be lost when the backend server is stopped or restarted.** This is suitable for a POC but would need to be replaced with a persistent database (like PostgreSQL, MongoDB, etc.) for a production application.

## Testing

For instructions on running the automated backend tests, please see `testing.md`.

## Future Work (Optional)

- Re-integrate a persistent database solution.
- Add more sophisticated survey types (e.g., ratings, multiple choice).
- Implement user management features for admins.
- Add unit and end-to-end tests.

## Project Structure

- `/pulse-app-backend`: Contains the NestJS backend application code.
- `/pulse-app-frontend`: Contains the React (Vite) frontend application code.

## Setup and Running

Follow these steps to set up and run both the backend and frontend servers.

### Backend (`pulse-app-backend`)

1. **Navigate:** `cd pulse-app-backend`

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server:**

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

   The backend server should now be running (usually on <http://localhost:3000>).

### Frontend (`pulse-app-frontend`)

1. **Navigate:** `cd pulse-app-frontend` (from the root directory)

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend development server should now be running (usually on <http://localhost:5173> or the next available port).

### Accessing the Application

- Ensure both the backend and frontend servers are running.
- Open your browser to the frontend URL (e.g., <http://localhost:5173>).
- You should be redirected to the login page.
- Register a new user or log in.

## Product Requirements Document (PRD)

**1. Problem Statement**

Organizations often struggle to get regular, honest feedback from employees about their work environment, satisfaction, and engagement. Traditional annual surveys are infrequent and may not capture timely issues. There's a need for a simple, anonymous (or pseudonymous) way for employees to share their thoughts and for management/HR to gauge the overall 'pulse' of the organization effectively.

**2. Target Users**

- **Employees:** Will use the application to quickly provide feedback on their current work sentiment, knowing their voice is heard regularly. They might also want to track their own submissions over time.
- **Administrators (HR/Management):** Will use the application to monitor overall employee sentiment trends, identify potential issues or areas for improvement across the organization, and make data-informed decisions. They need an easy way to view aggregated feedback and potentially export it for further analysis.

**3. User Stories**

- **Employee Perspective:**
  1. _Registration:_ As an employee, I want to register for an account using my work email and a password so that I can access the pulse survey tool.
  2. _Login:_ As an employee, I want to log in securely to the application so that I can submit my pulse survey response.
  3. _Survey Submission:_ As an employee, I want to answer the current pulse survey question with a simple text response so that I can quickly share my feedback.
  4. _View History:_ As an employee, I want to be able to view my previous survey submissions so that I can track my own sentiment over time.
- **Admin Perspective:** 5. _Admin Login:_ As an administrator, I want to log in securely to a separate admin portal so that I can manage and view survey data. 6. _View Responses:_ As an administrator, I want to view a list of all employee survey responses, including the submission date and the response text, so that I can gauge overall sentiment and identify common themes. 7. _Export Data:_ As an administrator, I want to export all survey responses into a CSV or JSON file so that I can perform offline analysis or share the data with other stakeholders.

**4. Key Features**

- **Employee View:**
  - Authentication: User Registration (Email/Password), User Login, User Logout
  - Survey Interaction: View Current Pulse Survey Question, Submit Text-Based Response
  - History: View List of Own Past Submissions
- **Admin View:**
  - Authentication: Admin Login, Admin Logout
  - Response Management: View All Employee Survey Submissions, Basic Filtering/Sorting
  - Data Export: Export All Submissions to CSV, Export All Submissions to JSON

**5. Feature Prioritization**

- **Must-Haves:**
  - Employee: Registration, Login, Submit Response, View Past Submissions
  - Admin: Login, View All Submissions, Export Data (CSV/JSON)
- **Nice-to-Haves:**
  - Employee: Password Reset, Profile Management, Edit/Delete Submissions
  - Admin: Advanced Filtering, Survey Question Management, User Management, Data Visualization, Role-Based Access

**6. Success Metrics**

- Adoption Rate (% registered users)
- Participation Rate (% users submitting per survey)
- Frequency of Use (Admin logins, data views)
- Data Export Usage (Frequency of exports)
- Qualitative Feedback (User satisfaction surveys/interviews)
- (Long-term) Correlation with Organizational KPIs (e.g., retention, eNPS)

### Wireframes (Text-Based)

**1. Employee Registration Screen**

```text
+------------------------------------------+
|         Employee Pulse App               |
+------------------------------------------+
|           Register New Account           |
|   Email:    [____________________]       |
|   Password: [____________________]       |
|   Confirm PW:[____________________]       |
|                [ Register ]              |
|          Already have an account?        |
|                  [ Log In ]              |
+------------------------------------------+
```

**2. Employee Login Screen**

```text
+------------------------------------------+
|         Employee Pulse App               |
+------------------------------------------+
|                Employee Login            |
|   Email:    [____________________]       |
|   Password: [____________________]       |
|                  [ Log In ]              |
|           Don't have an account?         |
|                 [ Register ]             |
+------------------------------------------+
```

**3. Employee Dashboard / Take Survey Screen**

```text
+------------------------------------------+
| Employee Pulse App        [ User Email ] |
|                           [ Logout ]     |
+------------------------------------------+
|  [ Take Survey ] | [ View Past Surveys ] |
+------------------------------------------+
|      Weekly Pulse Question:              |
|      "How are you feeling this week?"    |
|   Your Response:                         |
|   +-----------------------------------+  |
|   | [_______________________________] |  |
|   +-----------------------------------+  |
|                 [ Submit ]               |
+------------------------------------------+
```

**4. Employee View Past Submissions Screen**

```text
+------------------------------------------+
| Employee Pulse App        [ User Email ] |
|                           [ Logout ]     |
+------------------------------------------+
|  [ Take Survey ] | [ View Past Surveys ] |
+------------------------------------------+
|          Your Past Submissions           |
|   +-----------------------------------+  |
|   | Date       | Response Snippet     |  |
|   |------------|----------------------|  |
|   | 2023-10-27 | "Feeling great..."   |  |
|   | 2023-10-20 | "A bit stressed..."  |  |
|   | ...        | ...                  |  |
|   +-----------------------------------+  |
+------------------------------------------+
```

**5. Admin Login Screen**

```text
+------------------------------------------+
|         Employee Pulse App               |
|            (Admin Portal)                |
+------------------------------------------+
|                 Admin Login              |
|   Username: [____________________]       |
|   Password: [____________________]       |
|                  [ Log In ]              |
+------------------------------------------+
```

**6. Admin Dashboard / View Responses Screen**

```text
+-------------------------------------------------+
| Employee Pulse App (Admin)       [ Admin User ] |
|                                      [ Logout ] |
+-------------------------------------------------+
|  [ View Responses ]                             |
+-------------------------------------------------+
|               All Employee Responses            |
|       Filters: [ Date Range ] [ Search... ]     |
|   +------------------------------------------+  |
|   | Employee   | Date       | Response       |  |
|   |------------|------------|----------------|  |
|   | emp1@co.co | 2023-10-27 | "Feeling..."   |  |
|   | emp2@co.co | 2023-10-27 | "Good week..." |  |
|   | ...        | ...        | ...            |  |
|   +------------------------------------------+  |
|     [ Export as CSV ]   [ Export as JSON ]      |
+-------------------------------------------------+
```
