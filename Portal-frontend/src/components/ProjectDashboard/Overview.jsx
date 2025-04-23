import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Chip, Divider, Stack  } from '@mui/material';

const Overview = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    // Function to fetch selected project info from the server
    const fetchSelectedProject = async () => {
      try {
        // to get the selected project's ID
        const response = await axios.get('http://localhost:5000/api/projects/student/selected-project', {
          headers: {
            'x-auth-token': token,
          },
        });

        const projectId = response.data.projectId;

        if (projectId) {
          // If project ID is found, fetch full project details
          const projectDetails = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
            headers: {
              'x-auth-token': token,
            },
          });
          setSelectedProject(projectDetails.data);
        } else {
          setSelectedProject(null); 
        }
      } catch (error) {
        console.error('Error fetching selected project:', error);
        setSelectedProject(null); 
      } finally {
        setLoading(false); 
      }
    };

    fetchSelectedProject();
  }, []); 

  // Function to generate and download PDF for selected project
  const handleGeneratePDF = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      // Send a request to the backend to generate the PDF for the selected project
      const res = await axios.get(`http://localhost:5000/api/pdf/generate-pdf/${projectId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      const pdfUrl = res.data.pdfUrl;
      window.open(pdfUrl, '_blank');

    //   const link = document.createElement('a');
    //   link.href = pdfUrl;
    //   link.setAttribute('download', 'project_overview.pdf');
    // window.open(pdfUrl, '_blank');
    //   document.body.appendChild(link);
    //   link.click(); // Trigger the download
    //   document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading selected project...</Typography>;
  }

  return (
   
<div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'flex-start', 
  paddingTop: '20px',
  width: '100%', 
  
 
 
}}>
  {selectedProject ? (
    <Card sx={{ width: '100%', maxWidth: 700, mb: 2, p: 2, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold', textAlign:"center" }}>
          {selectedProject.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          <strong>Overview:</strong> {selectedProject.fullDesc?.overview}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Objective:</strong> {selectedProject.fullDesc?.objective}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Technologies:</strong>
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mt: 2, mb: 2 ,textAlign:"center"}}>
          {selectedProject.fullDesc?.technologies?.split(',').map((tech, index) => (
            <Chip key={index} label={tech.trim()} color="info" variant="outlined" />
          ))}
        </Stack>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Key Features:</strong>
        </Typography>
        <ul style={{ paddingLeft: '1.5rem' }}>
          {selectedProject.fullDesc?.features?.split('\n').map((feature, index) => (
            <li key={index}>
              <Typography variant="body2">{feature.trim()}</Typography>
            </li>
          ))}
        </ul>

        <Divider sx={{ my: 2 }} />

        <Button fullWidth variant="contained" color="success" onClick={() => handleGeneratePDF(selectedProject._id)}>
          Download Overview PDF
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Typography variant="h6" color="textSecondary" align="center">
      You have not selected any project yet.
    </Typography>
  )}
</div>

  );
};

export default Overview;


