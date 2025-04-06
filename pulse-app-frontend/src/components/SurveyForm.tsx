import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // To ensure user is logged in (though route is protected)
import styles from './SurveyForm.module.css'; // Import component CSS
import commonStyles from '../styles/common.module.css'; // Import common styles

function SurveyForm() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth(); // Get token to ensure we are logged in before enabling submit

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!response.trim()) {
        toast.error('Response cannot be empty.');
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Submitting survey...');

    try {
      // Axios instance has base URL and Authorization header from AuthContext interceptor
      await axios.post('/surveys', { response });
      toast.success('Survey submitted successfully!', { id: toastId });
      setResponse(''); // Clear the form
    } catch (err: any) {
      console.error("Survey submission error:", err);
      toast.error(`Submission failed: ${err.response?.data?.message || err.message || 'Server error'}`, {
          id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={commonStyles.innercontainer}>
      <h2 style={{ textAlign: 'center' , lineHeight: '1' ,margin:0, marginBottom: '20px'}}>Submit Weekly Pulse</h2>
      <form onSubmit={handleSubmit}>
        <div className={commonStyles.formGroup}>
          <textarea
            id="surveyResponse"
            className={commonStyles.input}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={3}
            maxLength={500}
            required
            disabled={isLoading}
            placeholder="How was your week?"
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className={commonStyles.button} disabled={isLoading || !token}>
            {isLoading ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SurveyForm; 