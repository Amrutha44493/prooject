import React, { useState, useEffect } from 'react';
import {
  Typography,
  Link,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { isWithinInterval, subDays, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode'; 

const FinalProjectSubmission = () => {
  const [studentId, setStudentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportLink, setReportLink] = useState('');
  const [reportComments, setReportComments] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [submissionStatusError, setSubmissionStatusError] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      console.log('Full decoded token:', decoded); // Log the entire decoded token to inspect its structure
      setStudentId(decoded.student.id); // Accessing studentId from the decoded token
      console.log('Decoded studentId from token:', decoded.student.id); 
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }, []);
  

  useEffect(() => {
    if (!studentId) return;
    const fetchSelectedProjectId = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get(
          'http://localhost:5000/api/projects/student/selected-project',
          {
            headers: { 'x-auth-token': token },
          }
        );
        setSelectedProjectId(response.data.projectId);
        console.log('Fetched Selected Project ID:', response.data.projectId);
      } catch (error) {
        console.error('Error fetching selected project ID:', error);
        setSubmissionStatusError('Failed to fetch project information.');
      }
    };

    fetchSelectedProjectId();
  }, [studentId]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchEndDate = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/project/${selectedProjectId}/end-date`,
          { headers: { 'x-auth-token': token } }
        );
        const fetchedEndDate = response.data.endDate;
        setEndDate(fetchedEndDate);
        console.log('Fetched End Date:', fetchedEndDate);
      } catch (error) {
        console.error('Error fetching project end date:', error);
        setSubmissionStatusError('Failed to fetch project end date.');
      }
    };

    fetchEndDate();
  }, [selectedProjectId]);

  useEffect(() => {
    if (!endDate) return;

    const parsedEndDate = parseISO(endDate);
    const submissionAvailableDate = subDays(parsedEndDate, 7);
    const now = new Date();

    const isOpen = isWithinInterval(now, {
      start: submissionAvailableDate,
      end: parsedEndDate,
    });
    setIsSubmissionOpen(isOpen);
  }, [endDate]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const token = getAuthToken();
    if (!token || !studentId || !selectedProjectId) {
      setSubmissionStatus({
        severity: 'error',
        message: 'Missing required data. Please try again.',
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('comment', reportComments);
    formData.append('projectId', selectedProjectId);

    if (selectedFile) {
      formData.append('file', selectedFile);
    } else if (!reportLink) {
      setSubmissionStatus({
        severity: 'error',
        message: 'Please upload a file or provide a link.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = `http://localhost:5000/api/final-reports/student/${studentId}/final-report`;
      const requestOptions = {
        method: 'POST',
        headers: { 'x-auth-token': token },
      };

      if (selectedFile) {
        requestOptions.body = formData;
      } else {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify({
          reportLink,
          comment: reportComments,
          projectId: selectedProjectId,
        });
      }

      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setSubmissionStatus({
          severity: 'success',
          message: data.message || 'Final report submitted successfully!',
        });
        setSelectedFile(null);
        setReportLink('');
        setReportComments('');
      } else {
        setSubmissionStatus({
          severity: 'error',
          message: data.message || 'Failed to submit final report.',
        });
      }
    } catch (error) {
      console.error('Error submitting final report:', error);
      setSubmissionStatus({ severity: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Final Project Report Submission
      </Typography>

      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 1,
          border: '1px solid #ddd',
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Sample Report Format:
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          target="_blank"
          rel="noopener noreferrer"
          download="sample-report-format.pdf"
        >
          Download Sample PDF
        </Button>
      </Box>

      <hr style={{ marginBottom: '20px', border: 'none', borderTop: '1px solid #ccc' }} />

      {submissionStatusError ? (
        <Alert severity="error">{submissionStatusError}</Alert>
      ) : isSubmissionOpen ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Submit Your Final Project Report:
          </Typography>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="report-submission-tabs">
            <Tab label="Upload File" />
            <Tab label="Link" />
          </Tabs>
          <form onSubmit={handleSubmit}>
            {activeTab === 0 && (
              <Box sx={{ mb: 2 }}>
                <label htmlFor="reportFile">
                  <Typography component="span">Upload Report (PDF):</Typography>
                </label>
                <input
                  type="file"
                  id="reportFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'block', marginTop: '5px' }}
                  required={activeTab === 0}
                />
              </Box>
            )}
            {activeTab === 1 && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Report Link"
                  id="reportLink"
                  type="url"
                  placeholder="Enter report link (e.g., Google Drive, GitHub)"
                  value={reportLink}
                  onChange={(e) => setReportLink(e.target.value)}
                  required={activeTab === 1}
                />
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comments"
                id="reportComments"
                value={reportComments}
                onChange={(e) => setReportComments(e.target.value)}
                placeholder="Add any relevant comments"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || (activeTab === 0 && !selectedFile) || (activeTab === 1 && !reportLink)}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Report'}
            </Button>

            {submissionStatus && (
              <Box sx={{ mt: 2 }}>
                <Alert severity={submissionStatus.severity}>{submissionStatus.message}</Alert>
              </Box>
            )}
          </form>
        </Paper>
      ) : (
        <Alert severity="info">
          Final report submission will be available during the last week of the project.
        </Alert>
      )}
    </Box>
  );
};

export default FinalProjectSubmission;
