/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/AdminSubmissionsTable.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import commonStyles from "../styles/common.module.css"; // Import common styles

// Define the shape of a survey object from the backend /surveys/all endpoint
// Note: Backend service uses .lean(), so it's plain objects.
// We need userId, might need user email if populated later.
interface AdminSurvey {
  _id: string;
  userId: string; // Currently just the ID string
  // user?: { email: string }; // If populated
  response: string;
  createdAt: string;
  updatedAt: string;
}

function AdminSubmissionsTable() {
  const [submissions, setSubmissions] = useState<AdminSurvey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    let toastId: string | undefined;
    const fetchSubmissions = async () => {
      if (!token) return;
      setIsLoading(true);
      toastId = toast.loading("Loading all submissions...");
      try {
        const response = await axios.get<AdminSurvey[]>("/surveys/all");
        setSubmissions(response.data);
        toast.dismiss(toastId);
      } catch (err: any) {
        console.error("Error fetching all submissions:", err);
        toast.error(
          `Failed to load submissions: ${
            err.response?.data?.message || err.message || "Server error"
          }`,
          {
            id: toastId
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
    return () => {
      if (toastId) toast.dismiss(toastId);
    };
  }, [token]);

  return (
    <div>
      {isLoading && <div className={commonStyles.loadingSpinner}></div>}
      {!isLoading && submissions.length === 0 && <p>No surveys have been submitted yet.</p>}
      {!isLoading && submissions.length > 0 && (
        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>User ID</th>
              {/*<th>User Email</th> If populated */}
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((survey) => (
              <tr key={survey._id}>
                <td>{new Date(survey.createdAt).toLocaleDateString()}</td>
                <td>{survey.userId}</td>
                {/*<td>{survey.user?.email || survey.userId}</td> */}
                <td>{survey.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminSubmissionsTable;
