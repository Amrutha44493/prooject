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

const WeeklySubmission = () => {
    const [studentId, setStudentId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportLink, setReportLink] = useState('');
    const [comments, setComments] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [isSubmissionPeriod, setIsSubmissionPeriod] = useState(true);
    const [currentWeek, setCurrentWeek] = useState(1);

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
            try {
                // Fetch all submissions
                const submissionsRes = await axios.get(
                    `http://localhost:5000/api/weekly-submissions/student/${studentId}`,
                    { headers: { 'x-auth-token': token } }
                );
                
                if (submissionsRes.data) {
                    setSubmissions(submissionsRes.data);
                    // Calculate current week (next week after last submission or week 1)
                    setCurrentWeek(submissionsRes.data.length > 0 ? 
                        Math.max(...submissionsRes.data.map(s => s.weekNumber)) + 1 : 1);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [studentId]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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

        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('comment', comments);
        formData.append('weekNumber', currentWeek);

        if (selectedFile) {
            formData.append('file', selectedFile);
        } else if (reportLink) {
            formData.append('link', reportLink);
        } else {
            setSubmissionStatus({
                severity: 'error',
                message: 'Please upload a file or provide a link.',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/weekly-submissions/submit',
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
                `http://localhost:5000/api/weekly-submissions/student/${studentId}`,
                { headers: { 'x-auth-token': token } }
            );
            setSubmissions(submissionsRes.data);
            setCurrentWeek(currentWeek + 1);

            // Reset form
            setSelectedFile(null);
            setReportLink('');
            setComments('');

        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionStatus({
                severity: 'error',
                message: error.response?.data?.message || 'Submission failed. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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
                                                        Week {submission.weekNumber} - {format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Type: {submission.submissionType}
                                                    </Typography>
                                                    {submission.submissionType === 'file' ? (
                                                        <Link href={submission.cloudinaryUrl} target="_blank">
                                                            View File
                                                        </Link>
                                                    ) : (
                                                        <Link href={submission.link} target="_blank">
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
                            >
                                Open Report Format
                            </Button>
                        </Box>

                        <Typography variant="h6" gutterBottom align="center">
                            Week Submission ({submissions.length + 0}/4)
                        </Typography>

                        {!isSubmissionPeriod ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Weekly report submission is only available at the end of each week.
                            </Alert>
                        ) : (
                            <>
                                <Typography variant="body2" paragraph color="text.secondary" align="center">
                                    Upload your report in PDF format (max 10MB) or provide a link
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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
                                                accept=".pdf,.doc,.docx"
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
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Add any relevant comments about this week's progress"
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
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default WeeklySubmission;