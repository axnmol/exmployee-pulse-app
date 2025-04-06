/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios"; // Import axios
import toast from "react-hot-toast"; // Import toast
import commonStyles from "../styles/common.module.css"; // Import common styles

// Base URL for the backend API - Ideally use AuthContext or env var
const API_BASE_URL = "http://localhost:3000";

function ExportButtons() {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);

  // We need the token to authorize the download request.
  // Since these are simple links, the browser needs to send the token.
  // The axios interceptor won't work for direct link clicks/downloads.
  // Option 1: Fetch blob using axios (more complex, handles auth header)
  // Option 2: Temporarily pass token in query param (LESS SECURE - avoid if possible)
  // Option 3: Use a server-side proxy or session cookies instead of Bearer tokens for downloads.

  // Let's implement Option 1 (fetch blob) for better security.

  const handleExport = async (format: "csv" | "json") => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    // Set loading state for specific button
    if (format === "csv") setIsExportingCsv(true);
    if (format === "json") setIsExportingJson(true);
    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);

    try {
      const response = await axios.get(`/surveys/export/${format}`, {
        baseURL: API_BASE_URL, // Explicitly set baseURL here as interceptor might not apply
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob" // Important: response type is blob
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `surveys.${format}`); // Set filename
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link); // Clean up
      window.URL.revokeObjectURL(url); // Clean up blob URL
      toast.success(`Exported successfully as ${format.toUpperCase()}!`, { id: toastId });
    } catch (err: any) {
      console.error(`Error exporting ${format}:`, err);
      toast.error(
        `Failed to export data as ${format}. ${err.response?.data?.message || err.message || ""}`,
        {
          id: toastId
        }
      );
    } finally {
      // Reset loading state for specific button
      if (format === "csv") setIsExportingCsv(false);
      if (format === "json") setIsExportingJson(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h4>Export Data</h4>
      <button
        onClick={() => handleExport("csv")}
        className={commonStyles.button}
        disabled={isExportingCsv || isExportingJson} // Disable both if either is running
      >
        {isExportingCsv ? "Exporting..." : "Export as CSV"}
      </button>
      <button
        onClick={() => handleExport("json")}
        className={commonStyles.button}
        disabled={isExportingCsv || isExportingJson}
      >
        {isExportingJson ? "Exporting..." : "Export as JSON"}
      </button>
    </div>
  );
}

export default ExportButtons;
