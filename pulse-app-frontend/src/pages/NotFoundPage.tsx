// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";
import commonStyles from "../styles/common.module.css";

function NotFoundPage() {
  return (
    <div className={commonStyles.container} style={{ textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFoundPage;
