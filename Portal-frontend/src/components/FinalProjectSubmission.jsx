import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Link, Alert,
    TextField, CircularProgress, Tabs, Tab
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { isWithinInterval, subDays, parseISO, format } from 'date-fns';
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
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [finalReportData, setFinalReportData] = useState(null);
    const [weeklySubmissionsCount, setWeeklySubmissionsCount] = useState(0);
    const [loadingWeeklyCount, setLoadingWeeklyCount] = useState(true);

    const getAuthToken = () => localStorage.getItem('token');

    useEffect(() => {
        const token = getAuthToken();
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            setStudentId(decoded.student.id);
        } catch (err) {
            console.error('Failed to decode token:', err);
        }
    }, []);

    useEffect(() => {
        if (!studentId) return;
        
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) return;

            try {
                // Fetch selected project ID
                const projectResponse = await axios.get(
                    'http://localhost:5000/api/projects/student/selected-project',
                    { headers: { 'x-auth-token': token } }
                );
                setSelectedProjectId(projectResponse.data.projectId);

                // Fetch weekly submissions count
                const weeklyResponse = await axios.get(
                    `http://localhost:5000/api/weekly-submissions/count/${studentId}`,
                    { headers: { 'x-auth-token': token } }
                );
                setWeeklySubmissionsCount(weeklyResponse.data.count || 0);

                // Fetch final report status
                const reportResponse = await axios.get(
                    `http://localhost:5000/api/final-reports/student/${studentId}`,
                    { headers: { 'x-auth-token': token } }
                );
                
                const report = reportResponse.data.finalProjectReport;
                setFinalReportData(report || null);
                setHasSubmitted(!!(report?.submissionStatus));

            } catch (error) {
                console.error('Error fetching data:', error);
                setSubmissionStatusError('Failed to fetch required data.');
            } finally {
                setLoadingWeeklyCount(false);
            }
        };

        fetchData();
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
                setEndDate(response.data.endDate);
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

        try {
            const apiUrl = `http://localhost:5000/api/final-reports/student/${studentId}/final-report`;
            const headers = { 'x-auth-token': token };
            let formDataOrJson;
            let contentType;

            if (activeTab === 0 && selectedFile) {
                formDataOrJson = new FormData();
                formDataOrJson.append('comment', reportComments);
                formDataOrJson.append('projectId', selectedProjectId);
                formDataOrJson.append('file', selectedFile);
                contentType = 'multipart/form-data';
            } else if (activeTab === 1 && reportLink) {
                formDataOrJson = {
                    reportLink,
                    comment: reportComments,
                    projectId: selectedProjectId,
                };
                contentType = 'application/json';
                headers['Content-Type'] = contentType;
            } else {
                setSubmissionStatus({
                    severity: 'error',
                    message: 'Please upload a file or provide a link.',
                });
                setIsSubmitting(false);
                return;
            }

            const response = await axios.post(apiUrl, formDataOrJson, { headers });
            const data = response.data;

            if (response.status === 200) {
                setSubmissionStatus({
                    severity: 'success',
                    message: data.message || 'Final report submitted successfully!',
                });
                setSelectedFile(null);
                setReportLink('');
                setReportComments('');
                setHasSubmitted(true);
                setFinalReportData(data.finalProjectReport || null);
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

    const canSubmitFinalReport = weeklySubmissionsCount >= 4 && isSubmissionOpen;

    if (loadingWeeklyCount) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Final Project Report
                </Typography>

                {!hasSubmitted ? (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DescriptionIcon />}
                                component={Link}
                                href="https://docs.google.com/document/d/1hhvLtEZS4mmFhT_Bzw3xfbDr3_bTqmiJbZbf9Upud7E/edit?usp=sharing"
                                target="_blank"
                            >
                                Open Report Format
                            </Button>
                        </Box>

                        {!isSubmissionOpen && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Final report submission will open one week before project end date.
                            </Alert>
                        )}

                        {!canSubmitFinalReport && isSubmissionOpen && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                You need to complete weekly submissions before you can submit the final report.
                                (Current: {weeklySubmissionsCount}/4)
                            </Alert>
                        )}

                        {canSubmitFinalReport && (
                            <>
                                <Typography variant="h6" gutterBottom align="center" sx={{ mt: 3 }}>
                                    Submit Final Report
                                </Typography>
                                <Typography variant="body2" paragraph color="text.secondary" align="center">
                                    Upload your report in PDF format (max 10MB) or provide a link
                                </Typography>

                                {submissionStatusError && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {submissionStatusError}
                                    </Alert>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                                        <Tab label="Upload File" />
                                        <Tab label="Link" />
                                    </Tabs>

                                    {activeTab === 0 && (
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            {selectedFile ? `Selected: ${selectedFile.name}` : 'Select File'}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                        </Button>
                                    )}

                                    {activeTab === 1 && (
                                        <TextField
                                            fullWidth
                                            label="Report Link"
                                            value={reportLink}
                                            onChange={(e) => setReportLink(e.target.value)}
                                            placeholder="Enter report link (e.g., Google Drive, GitHub)"
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Comments"
                                        value={reportComments}
                                        onChange={(e) => setReportComments(e.target.value)}
                                        placeholder="Add any relevant comments"
                                        sx={{ mb: 2 }}
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || (activeTab === 0 && !selectedFile) || (activeTab === 1 && !reportLink)}
                                    >
                                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit Report'}
                                    </Button>

                                    {submissionStatus && (
                                        <Alert severity={submissionStatus.severity} sx={{ width: '100%', mt: 2 }}>
                                            {submissionStatus.message}
                                        </Alert>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Final report submitted successfully! Waiting for review.
                        </Alert>

                        {finalReportData && (
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <Typography variant="subtitle1">📄 Submission Details:</Typography>
                                <Typography variant="body2"><strong>Type:</strong> {finalReportData.submissionType}</Typography>

                                {finalReportData.submissionType === 'file' && (
                                    <Typography variant="body2">
                                        <strong>File:</strong>{' '}
                                        <Link href={finalReportData.cloudinaryUrl} target="_blank" rel="noopener">
                                            View Uploaded File
                                        </Link>
                                    </Typography>
                                )}

                                {finalReportData.submissionType === 'link' && (
                                    <Typography variant="body2">
                                        <strong>Link:</strong>{' '}
                                        <Link href={finalReportData.link} target="_blank" rel="noopener">
                                            {finalReportData.link}
                                        </Link>
                                    </Typography>
                                )}

                                {finalReportData.comments && (
                                    <Typography variant="body2"><strong>Comments:</strong> {finalReportData.comments}</Typography>
                                )}

                                <Typography variant="body2">
                                    <strong>Date:</strong>{' '}
                                    {finalReportData.submissionDate
                                        ? format(new Date(finalReportData.submissionDate), 'dd MMM yyyy, hh:mm a')
                                        : 'N/A'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default FinalProjectSubmission;