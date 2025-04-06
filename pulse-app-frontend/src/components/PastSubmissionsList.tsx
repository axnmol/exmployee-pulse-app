/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/PastSubmissionsList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import commonStyles from "../styles/common.module.css"; // Import common styles

// Define the shape of a survey object from the backend
interface Survey {
  _id: string;
  userId: string; // Or could be populated User object if backend changes
  response: string;
  createdAt: string; // Assuming ISO date string
  updatedAt: string;
}

function PastSubmissionsList() {
  const [submissions, setSubmissions] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth(); // Need token to make authenticated request

  useEffect(() => {
    let toastId: string | undefined; // Declare toastId here

    const fetchSubmissions = async () => {
      if (!token) return;
      setIsLoading(true);
      toastId = toast.loading("Loading submissions..."); // Assign here

      try {
        // Axios instance has base URL and Auth header interceptor
        const response = await axios.get<Survey[]>("/surveys"); // Fetches user's own surveys
        setSubmissions(response.data);
        toast.dismiss(toastId); // Dismiss loading toast on success
      } catch (err: any) {
        console.error("Error fetching submissions:", err);
        toast.error(
          `Failed to load submissions: ${
            err.response?.data?.message || err.message || "Server error"
          }`,
          {
            id: toastId
          }
        );
        // Don't set submissions if fetch failed
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
    // Cleanup function can now access toastId from the outer scope
    return () => {
      if (toastId) toast.dismiss(toastId);
    };
  }, [token]); // Re-fetch if token changes (e.g., after login)

  return (
    // Make this container a flex column that fills height
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Heading - does not shrink */}
      <h3 style={{ lineHeight: "1", flexShrink: 0, marginBottom: "15px" /* Add some space */ }}>
        Your Past Submissions
      </h3>

      {/* Wrapper for scrollable content - grows and scrolls */}
      {/* Apply maxHeight to limit height before scrolling */}
      <div style={{ flexGrow: 1, maxHeight: 200, overflowY: "auto" }}>
        {isLoading && <div className={commonStyles.loadingSpinner}></div>}
        {!isLoading && submissions.length === 0 && <p>You haven't submitted any surveys yet.</p>}
        {!isLoading && submissions.length > 0 && (
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((survey) => (
                <tr key={survey._id}>
                  <td>{new Date(survey.createdAt).toLocaleDateString()}</td>
                  <td>{survey.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PastSubmissionsList;
