# Application Testing Walkthrough

This document provides steps to test the core functionality of the Employee Pulse Application.

## Prerequisites

Ensure both the backend and frontend servers are running:

1. **Backend:** Navigate to `pulse-app-backend` and run `npm run start:dev`.
2. **Frontend:** Navigate to `pulse-app-frontend` and run `npm run dev`.

## Testing Steps

1. **Access App:**

   - Open your web browser to the frontend URL provided by the Vite server (e.g., `http://localhost:5173`).
   - _Expected:_ You should see the Login page with the light pastel theme and frosted glass container.

2. **Register Employee:**

   - Click the "Register" link below the login form.
   - Enter a unique email (e.g., `employee1@test.com`) and a password (e.g., `password123`).
   - Click the "Register" button.
   - _Expected:_ A success toast notification appears ("Registration successful!"). You are redirected back to the Login page.

3. **Login as Employee:**

   - Enter the credentials you just registered (`employee1@test.com` / `password123`).
   - Click the "Login" button.
   - _Expected:_ A loading toast appears, followed by a success toast ("Login successful!"). You are redirected to the Employee Dashboard (`/employee`). The layout shows a header with your email and a Logout button, followed by a tab navigation (Home, Take Survey, View History).

4. **Submit Survey (Employee):**

   - Click the "Take Survey" tab.
   - Enter a response in the text area (e.g., "My week was productive."). The text area should have consistent styling and no focus outline.
   - Click the "Submit Response" button.
   - _Expected:_ A loading toast appears, followed by a success toast ("Survey submitted successfully!"). The text area clears.
   - Submit a second response (e.g., "Feeling good about project progress.").

5. **View History (Employee):**

   - Click the "View History" tab.
   - _Expected:_ The "Your Past Submissions" heading is visible and fixed at the top of the content area. The table below lists your two submissions. If you were to add many more submissions, the table area should scroll vertically, keeping the heading visible (up to the defined `maxHeight`).

6. **Logout (Employee):**

   - Click the "Logout" button in the header.
   - _Expected:_ You are redirected to the Login page.

7. **Login as Admin:**

   - Enter the hardcoded admin credentials: `admin@test.com` / `password123`.
   - Click the "Login" button.
   - _Expected:_ A success toast appears. You are redirected to the Admin Dashboard (`/admin`).

8. **View Submissions (Admin):** \* _Expected:_ The Admin Dashboard displays. You see the header, the export buttons in a row, and the submissions table.
   The table lists the submissions previously made by `employee1@test.com`. The table area should expand vertically to use the available space below the export buttons, and a vertical scrollbar should appear if the content overflows.

9. **Export Data (Admin):**

   - Click the "Export as CSV" button.
   - _Expected:_ A loading toast appears, then a success toast. A CSV file containing the submissions is downloaded.
   - Click the "Export as JSON" button.
   - _Expected:_ A loading toast appears, then a success toast. A JSON file containing the submissions is downloaded. (Verify file contents if desired).

10. **Logout (Admin):**

    - Click the "Logout" button in the header.
    - _Expected:_ You are redirected to the Login page.

11. **(Optional) Test Data Reset:**
    - Stop the backend server (`Ctrl+C` in its terminal).
    - Restart the backend server (`npm run start:dev`).
    - Try logging in as `employee1@test.com`.
      - _Expected:_ Login fails with an "Invalid email or password" error toast (as the user was only stored in memory).
    - Log in as `admin@test.com`.
      - _Expected:_ Login succeeds.
    - Navigate to the Admin Dashboard.
      - _Expected:_ The submissions table is now empty, as the in-memory survey data was cleared on restart.
