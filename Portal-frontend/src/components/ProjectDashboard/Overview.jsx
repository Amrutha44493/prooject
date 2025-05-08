import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Divider, 
  Stack,
  Box,
  Fade,
  Skeleton,
  Paper,
  Avatar,
  Grid
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import StarIcon from '@mui/icons-material/Star';
import DownloadIcon from '@mui/icons-material/Download';
import WorkIcon from '@mui/icons-material/Work';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TimelineIcon from '@mui/icons-material/Timeline';

// Default project banner image
const defaultBannerImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';

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
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      p: 3,
      minHeight: '80vh',
      background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)'
    }}>
      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%', 
            maxWidth: 900, 
            borderRadius: 4,
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}
        >
          {selectedProject ? (
            <Card sx={{ background: 'transparent' }}>
              {/* Project Banner Image */}
              <Box
                sx={{
                  height: 200,
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
                    zIndex: 1
                  }
                }}
              >
                <img
                  src={defaultBannerImage}
                  alt="Project Banner"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    color: 'white',
                    zIndex: 2,
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {selectedProject.title}
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  {/* Overview Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                      height: '100%'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'primary.main',
                          mb: 2
                        }}
                      >
                        <DescriptionIcon /> Overview
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {selectedProject.fullDesc?.overview}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Objective Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: 'rgba(46, 125, 50, 0.04)',
                      height: '100%'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'success.main',
                          mb: 2
                        }}
                      >
                        <LightbulbIcon /> Objective
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {selectedProject.fullDesc?.objective}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Technologies Section */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: 'rgba(156, 39, 176, 0.04)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'secondary.main',
                          mb: 2
                        }}
                      >
                        <CodeIcon /> Technologies
                      </Typography>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{ 
                          flexWrap: 'wrap', 
                          gap: 1
                        }}
                      >
                        {selectedProject.fullDesc?.technologies?.split(',').map((tech, index) => (
                          <Chip 
                            key={index} 
                            label={tech.trim()} 
                            color="secondary" 
                            variant="outlined"
                            sx={{ 
                              borderRadius: '16px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'secondary.main',
                                color: 'white'
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Key Features Section */}
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: 'rgba(237, 108, 2, 0.04)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'warning.main',
                          mb: 2
                        }}
                      >
                        <TimelineIcon /> Key Features
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedProject.fullDesc?.features?.split('\n').map((feature, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: 'rgba(255,255,255,0.5)'
                            }}>
                              <Avatar sx={{ 
                                bgcolor: 'warning.main',
                                width: 24,
                                height: 24
                              }}>
                                <StarIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {feature.trim()}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleGeneratePDF(selectedProject._id)}
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Download Project Overview
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }}>
              <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
              <Typography 
                variant="h6" 
                color="textSecondary"
                sx={{ 
                  fontSize: '1.2rem',
                  color: 'text.secondary'
                }}
              >
                You have not selected any project yet.
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Overview;


