import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Link, Alert,
    TextField, CircularProgress, Tabs, Tab, Card, CardContent, List, ListItem, Divider
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:5000/api';

const WeeklySubmission = () => {
    const [studentId, setStudentId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportLink, setReportLink] = useState('');
    const [comments, setComments] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [isSubmissionPeriod, setIsSubmissionPeriod] = useState(false); // Initialize as closed
    const [currentWeek, setCurrentWeek] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const getAuthToken = () => localStorage.getItem('token');

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            setSubmissionStatus({
                severity: 'error',
                message: 'Authentication required. Please login.',
            });
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setStudentId(decoded.student?.id);
        } catch (err) {
            console.error('Failed to decode token:', err);
            setSubmissionStatus({
                severity: 'error',
                message: 'Invalid authentication token.',
            });
        }
    }, []);

    useEffect(() => {
        if (!studentId) return;

        const fetchData = async () => {
            const token = getAuthToken();
            try {
                setIsLoading(true);

                // Check submission period status
                const periodRes = await axios.get(
                    `${API_BASE_URL}/weekly-submissions/period`,
                    { headers: { 'x-auth-token': token } }
                );
                setIsSubmissionPeriod(periodRes.data.isOpen);

                // Fetch all submissions
                const submissionsRes = await axios.get(
                    `${API_BASE_URL}/weekly-submissions/student/${studentId}`,
                    { headers: { 'x-auth-token': token } }
                );

                if (submissionsRes.data) {
                    setSubmissions(submissionsRes.data);
                    setCurrentWeek(submissionsRes.data.length > 0 ?
                        Math.max(...submissionsRes.data.map(s => s.weekNumber)) + 1 : 1);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setSubmissionStatus({
                    severity: 'error',
                    message: error.response?.data?.message || 'Failed to load submission data.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (file.size > 10 * 1024 * 1024) {
                setSubmissionStatus({
                    severity: 'error',
                    message: 'File size exceeds 10MB limit.',
                });
                event.target.value = '';
                return;
            }

            setSelectedFile(file);
            setSubmissionStatus(null);
        }
    };

    const validateLink = (link) => {
        try {
            new URL(link);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);

        const token = getAuthToken();
        if (!token || !studentId) {
            setSubmissionStatus({
                severity: 'error',
                message: 'Authentication error. Please login again.',
            });
            setIsSubmitting(false);
            return;
        }

        // Validate inputs
        if (activeTab === 1 && reportLink && !validateLink(reportLink)) {
            setSubmissionStatus({
                severity: 'error',
                message: 'Please enter a valid URL for the report link.',
            });
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('comment', comments);
        formData.append('weekNumber', currentWeek);

        if (activeTab === 0 && selectedFile) {
            formData.append('file', selectedFile);
        } else if (activeTab === 1 && reportLink) {
            formData.append('link', reportLink);
        } else {
            setSubmissionStatus({
                severity: 'error',
                message: 'Please upload a file or provide a valid link.',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/weekly-submissions/submit`,
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSubmissionStatus({
                severity: 'success',
                message: response.data.message || 'Submission successful!',
            });

            // Refresh submissions
            const submissionsRes = await axios.get(
                `${API_BASE_URL}/weekly-submissions/student/${studentId}`,
                { headers: { 'x-auth-token': token } }
            );
            setSubmissions(submissionsRes.data);
            setCurrentWeek(prev => prev + 1);

            // Reset form
            setSelectedFile(null);
            setReportLink('');
            setComments('');

        } catch (error) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.message ||
                                 error.response?.data?.error ||
                                 'Submission failed. Please try again.';

            setSubmissionStatus({
                severity: 'error',
                message: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSelectedFile(null);
        setReportLink('');
        setSubmissionStatus(null);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Weekly Report Submission
                </Typography>

                {submissions.length >= 4 ? (
                    <Box>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            ✅ You have completed all 4 weekly submissions.
                        </Alert>

                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Your Submission History
                                </Typography>
                                <List>
                                    {submissions.map((submission, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="subtitle1">
                                                        Week {submission.weekNumber} - {format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm')}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Type: {submission.submissionType}
                                                    </Typography>
                                                    {submission.submissionType === 'file' ? (
                                                        <Link href={submission.cloudinaryUrl} target="_blank" rel="noopener">
                                                            View File
                                                        </Link>
                                                    ) : (
                                                        <Link href={submission.link} target="_blank" rel="noopener">
                                                            {submission.link}
                                                        </Link>
                                                    )}
                                                    {submission.comment && (
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            Comments: {submission.comment}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </ListItem>
                                            {index < submissions.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DescriptionIcon />}
                                component={Link}
                                href="https://docs.google.com/document/d/1ZgudQFgjmyYYYGqoNkcVI6uBClM3xBPVrB345PtXkTM/edit?usp=sharing"
                                target="_blank"
                                rel="noopener"
                            >
                                Open Report Format
                            </Button>
                        </Box>

                        <Typography variant="h6" gutterBottom align="center">
                            Week {submissions.length + 1} Submission ({submissions.length}/4)
                        </Typography>

                        {!isSubmissionPeriod ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Weekly report submission is only available on weekends (Saturday and Sunday).
                            </Alert>
                        ) : (
                            <>
                                <Typography variant="body2" paragraph color="text.secondary" align="center">
                                    Upload your report (max 10MB) or provide a link
                                </Typography>

                                {submissionStatus && (
                                    <Alert severity={submissionStatus.severity} sx={{ mb: 2 }}>
                                        {submissionStatus.message}
                                    </Alert>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                                        <Tab label="Upload File" />
                                        <Tab label="Link" />
                                    </Tabs>

                                    {activeTab === 0 && (
                                        <>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                startIcon={<CloudUploadIcon />}
                                                disabled={!isSubmissionPeriod}
                                            >
                                                {selectedFile ? `Selected: ${selectedFile.name}` : 'Select File'}
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={handleFileChange}
                                                />
                                            </Button>
                                            <Typography variant="caption" color="text.secondary">
                                                Max 10MB file size
                                            </Typography>
                                        </>
                                    )}

                                    {activeTab === 1 && (
                                        <TextField
                                            fullWidth
                                            label="Report Link"
                                            value={reportLink}
                                            onChange={(e) => setReportLink(e.target.value)}
                                            placeholder="Enter report link (e.g., Google Drive, GitHub)"
                                            sx={{ mb: 2 }}
                                            disabled={!isSubmissionPeriod}
                                        />
                                    )}

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Add any relevant comments about this week's progress"
                                        sx={{ mb: 2 }}
                                        disabled={!isSubmissionPeriod}
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={!isSubmissionPeriod || isSubmitting ||
                                            (activeTab === 0 && !selectedFile) ||
                                            (activeTab === 1 && !reportLink)}
                                        sx={{ width: '100%', maxWidth: 300 }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                                Submitting...
                                            </>
                                        ) : 'Submit Report'}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default WeeklySubmission;