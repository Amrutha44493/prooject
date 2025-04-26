import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/GridLegacy";
import Paper from "@mui/material/Paper";
import { Button, Typography, Tabs, Tab, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const AddSubmission = ({ onBack }) => {
  const [submissionType, setSubmissionType] = useState('link');
  const [comment, setComment] = useState('');
  const [link, setLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setSubmissionType(newValue);
    setLink('');
    setSelectedFile(null);
    setError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        setError('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      const token = localStorage.getItem('token');
      
      if (!studentId || !token) {
        setError('Please log in again to submit your work.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (!comment) {
        setError('Please add a comment');
        return;
      }

      if (submissionType === 'link' && !link) {
        setError('Please provide a link');
        return;
      }

      if (submissionType === 'file' && !selectedFile) {
        setError('Please upload a file');
        return;
      }

      const formData = new FormData();
      formData.append('student_id', studentId);
      formData.append('comment', comment);
      
      if (submissionType === 'file') {
        // Check file size (10MB limit)
        if (selectedFile.size > 10 * 1024 * 1024) {
          setError('File size should be less than 10MB');
          return;
        }
        
        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-rar-compressed'];
        if (!allowedTypes.includes(selectedFile.type)) {
          setError('Only PDF, DOC, DOCX, ZIP, and RAR files are allowed');
          return;
        }

        formData.append('file', selectedFile);
        console.log('File details:', {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        });
      } else {
        formData.append('link', link);
      }

      console.log('Submitting form data:', {
        student_id: studentId,
        comment,
        submissionType,
        file: submissionType === 'file' ? {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        } : null,
        link: submissionType === 'link' ? link : null
      });

      const response = await axios.post('http://localhost:5000/api/weekly-submissions/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        },
      });

      console.log('Submission response:', response.data);

      setSuccess('Submission successful!');
      setComment('');
      setLink('');
      setSelectedFile(null);
      setError('');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(error.response.data.message || 'Error submitting your work. Please try again.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Error submitting your work. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Submit Weekly Report</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              onBack();
              setComment('');
              setLink('');
              setSelectedFile(null);
              setError('');
              setSuccess('');
            }}
          >
            Back to Weekly Submission
          </Button>
        </Box> */}

        <Tabs
          value={submissionType}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab 
            value="link" 
            label="Submit Link" 
            icon={<LinkIcon />} 
            iconPosition="start" 
          />
          <Tab 
            value="file" 
            label="Upload File" 
            icon={<CloudUploadIcon />} 
            iconPosition="start" 
          />
        </Tabs>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Item>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Add a comment..."
              />
            </Item>
          </Grid>

          {submissionType === 'link' ? (
            <Grid item xs={12}>
              <Item>
                <TextField
                  fullWidth
                  label="Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Enter your GitHub link or other relevant URL"
                />
              </Item>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Item>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload File'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.zip,.rar"
                  />
                </Button>
                {selectedFile && (
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "#f5f5f5",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Selected file: {selectedFile.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedFile(null)}
                      aria-label="remove file"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Item>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {success && (
            <Grid item xs={12}>
              <Alert severity="success">{success}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                size="large"
              >
                Submit Weekly Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddSubmission;
