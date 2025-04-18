import React, { useState, useEffect } from 'react';
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSelect = async (projectId) => {
    const confirmSelection = window.confirm("Are you sure you want to select this project? You won't be able to select any other project later.");
    if (confirmSelection) {
      const token = localStorage.getItem('token'); 

      try {
        const response = await axios.post(
         'http://localhost:5000/projects/select/${projectId}', 
          {},
          {
            headers: {
              Authorization: `Bearer ${token} `
            }
          }
        );

        if (response.status === 200) {
          alert("Project selected successfully!");
          setSelectedProject(projectId);
          navigate("/ProjectDashboard");
        }
      } catch (error) {
        console.error("Project selection failed:", error.response.data.message || error.message);
        alert("Project selection failed.");
      }
    }
  };


  return (
    <div>          <StudentNav/>

    <Container sx={{ padding: 3 }}>

     <Typography variant="h4"  align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#1565c0' }}  gutterBottom >
       Student Dashboard
     </Typography>
     <hr></hr>
      <Typography variant="h4" gutterBottom  align="center" sx={{mt:3,mb:2}}>List of Available Projects</Typography>
      {projects.map((project) => (
          <Accordion
            key={project._id}
            expanded={expanded === project._id}
            onChange={handleChange(project._id)}
            sx={{ marginBottom: 2 ,borderRadius: 2,
              boxShadow: 3,
              border: '1px solid #ccc',
              overflow: 'hidden',
              background: '#f9f9f9',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}}
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
                }}}
            >
             
              <Typography variant="h6" sx={{ fontWeight: 'bold'}}>{project.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Frontend Technologies Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, 
                    width:270,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Frontend:</strong></Typography>
                      <Typography>{project.frontend}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Backend Technologies Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, // Adjust height as needed
                    width:270,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Backend:</strong></Typography>
                      <Typography>{project.backend}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Overview Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, // Adjust height as needed
                    width:400,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Overview:</strong></Typography>
                      <Typography>{project.fullDesc.overview}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Technologies Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, // Adjust height as needed
                    width:270,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Technologies:</strong></Typography>
                      <Typography>{project.fullDesc.technologies}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Features Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, // Adjust height as needed
                    width:300,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Features:</strong></Typography>
                      <Typography>{project.fullDesc.features}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Objective Card */}
                <Grid item xs={2}>
                  <Card sx={{
                    height: 100, // Adjust height as needed
                    width:400,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: '#e0f7fa', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6"><strong>Objective:</strong></Typography>
                      <Typography>{project.fullDesc.objective}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}> 
                <Button variant="contained"sx={{ mt: 2 ,mx:60,borderRadius: 5}}  
                    onClick={() => handleSelect(project._id)}disabled={selectedProject !== null && selectedProject !== project._id}>
                        {selectedProject === project._id ? 'Selected' : 'Select'}</Button>
                </Grid>
                
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
    </Container></div>
  );
};

export default StudentDashboard;
