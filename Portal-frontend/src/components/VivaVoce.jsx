import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Link, Alert } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const VivaVoce = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [vivaVoceData, setVivaVoceData] = useState(null);

  useEffect(() => {
    const fetchVivaVoceStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/viva-voce', {
          headers: {
            'x-auth-token': token
          }
        });

        setCanSubmit(response.data.canSubmitVivaVoce);
        setHasSubmitted(!!response.data.vivaVoce);
        setVivaVoceData(response.data.vivaVoce);
      } catch (error) {
        console.error('Error fetching viva voce status:', error);
      }
    };

    fetchVivaVoceStatus();
  }, []);

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
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in again to submit your viva voce.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (!selectedFile) {
        setError('Please select a file to upload');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('http://localhost:5000/api/viva-voce/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        },
      });

      setSuccess('Viva voce submitted successfully!');
      setSelectedFile(null);
      setError('');
      setHasSubmitted(true);
      setCanSubmit(false);
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Error submitting your viva voce. Please try again.');
      } else {
        setError('Error submitting your viva voce. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Viva Voce Format
        </Typography>
        <Typography variant="body1" paragraph>
          
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DescriptionIcon />}
            component={Link}
            href="https://docs.google.com/document/d/1OLH0LF0jM8TY73GOogSHiHzjgwvQKp-dooBw_Btb4wI/edit?addon_store&tab=t.0"
            target="_blank"
          >
            Open Viva Voce Format
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom align="center">
          Upload Viva Voce
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary" align="center">
          Upload your viva voce in PDF format (max 10MB)
        </Typography>

        {!canSubmit && !hasSubmitted && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You must submit your project report before you can submit the viva voce.
          </Alert>
        )}

        {hasSubmitted && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You have already submitted your viva voce. Only one submission is allowed.
          </Alert>
        )}

        {canSubmit && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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

            {selectedFile && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Viva Voce
              </Button>
            )}

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                {success}
              </Alert>
            )}
          </Box>
        )}

        {hasSubmitted && vivaVoceData && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your submitted viva voce:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              File: {vivaVoceData.fileName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on: {new Date(vivaVoceData.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VivaVoce; 