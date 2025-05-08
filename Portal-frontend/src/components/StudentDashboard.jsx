import React, { useState, useEffect } from 'react';
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, Grid, Button, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentNav from './StudentNav';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch all projects
    axios.get('http://localhost:5000/api/projects', {
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        alert("Unauthorized access. Please login again.");
      });

    // Fetch selected project for this user
    axios.get('http://localhost:5000/api/projects/student/selected-project', {
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.projectId) {
          setSelectedProject(response.data.projectId);
        }
      })
      .catch(err => {
        console.log("No previously selected project");
      });

  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSelect = async (projectId) => {
    const confirmSelection = window.confirm("Are you sure you want to select this project? You won't be able to select any other project later.");
    if (confirmSelection) {
      const token = localStorage.getItem('token');
      console.log("Token received:", token);


      try {
        const response = await axios.post(
          `http://localhost:5000/api/projects/select/${projectId}`,
          {},
          {
            headers: {
              'x-auth-token': token
            }
          }
        );

        if (response.status === 200) {
          alert("Project selected successfully!");
          setSelectedProject(projectId);
          navigate(`/ProjectDashboard`); // Ensure projectId is in the route
        }
      } catch (error) {
        console.error("Project selection failed:", error.response?.data?.message || error.message);

        if (error.response?.data?.message === "You have already selected a project.") {
          alert("You have already selected a project. You can't select another one.");
        } else {
          alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <div>
      <StudentNav />
      <Container maxWidth="lg" sx={{ py: 6, mt: 2, background: 'linear-gradient(135deg,rgb(75, 72, 72),rgb(163, 147, 147))', width: "80%", borderRadius: 7 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
          Student Dashboard
        </Typography>
        <hr></hr>
        <Typography variant="h5" align="center" sx={{ color: 'white', fontWeight: 600, mb: 5, mt: 3 }}>
          Explore Available Projects
        </Typography>

        {projects.map((project) => (
          <Box key={project._id} display="flex" justifyContent="center">
            <Accordion
              expanded={expanded === project._id}
              onChange={handleChange(project._id)}
              sx={{
                mb: 3,
                width: '80%',
                maxWidth: 800,
                borderRadius: 7,
                border: '1px solid #cfd8dc',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                backgroundColor: '#e3f2fd',
                transition: '0.4s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                    {expanded === project._id ? '▾' : '▸'}
                  </span>
                }
                sx={{
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {project.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={4} justifyContent="center" >
                  {[
                    { label: 'Frontend', value: project.frontend },
                    { label: 'Backend', value: project.backend },
                    { label: 'Overview', value: project.fullDesc?.overview },
                    { label: 'Technologies', value: project.fullDesc?.technologies },
                    { label: 'Features', value: project.fullDesc?.features },
                    { label: 'Objective', value: project.fullDesc?.objective },
                  ].map((item, i) => (
                    <Grid key={i} item xs={12} sm={6} md={4} lg={2}>
                      <Card
                        sx={{
                          marginTop: 2,
                          height: 140,
                          width: 270,
                          borderRadius: 4,
                          padding: 2.5,
                          backgroundColor: '#bbdefb',
                          boxShadow: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1, color: '#0d47a1', fontSize: '1.1rem' }}
                          >
                            {item.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#333', fontSize: '1rem' }}>
                            {item.value}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 5,
                        px: 5,
                        py: 1.5,
                        backgroundColor:
                          selectedProject === project._id ? '#2e7d32' : '#1976d2',
                        '&:hover': {
                          backgroundColor:
                            selectedProject === project._id ? '#1b5e20' : '#1565c0',
                        },
                      }}
                      onClick={() => handleSelect(project._id)}
                      disabled={
                        selectedProject !== null &&
                        selectedProject !== project._id
                      }
                    >
                      {selectedProject === project._id ? 'Selected' : 'Select'}
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Container>

    </div>
  );
};

export default StudentDashboard;