import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentNav from './StudentNav';
import { ChevronRight } from '@mui/icons-material';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [animatePanel, setAnimatePanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/projects', {
      headers: { 'x-auth-token': token }
    })
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        alert("Unauthorized access. Please login again.");
      });

    axios.get('http://localhost:5000/api/projects/student/selected-project', {
      headers: { 'x-auth-token': token }
    })
      .then(response => {
        if (response.data.projectId) {
          setSelectedProjectId(response.data.projectId);
          setExpandedProject(response.data.projectId);
        }
      })
      .catch(() => console.log("No previously selected project."));
  }, []);

  const handleProjectClick = (projectId) => {
    setAnimatePanel(false);
    setTimeout(() => {
      setExpandedProject(projectId);
      setAnimatePanel(true);
    }, 10); // Short delay to retrigger animation
  };

  const handleSelect = async (projectId) => {
    const confirmSelection = window.confirm("Are you sure you want to select this project? You won't be able to select any other project later.");
    if (!confirmSelection) return;

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/select/${projectId}`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (response.status === 200) {
        alert("Project selected successfully!");
        setSelectedProjectId(projectId);
        navigate(`/ProjectDashboard`);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong.";
      alert(message);
    }
  };

  const selectedProject = projects.find(p => p._id === expandedProject);

  return (
    <>
      <style>
      {`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in {
          animation: slideIn 1.5s ease forwards;
        }

        @keyframes slideIn1 {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in1 {
          animation: slideIn 3.5s ease forwards;
        }
      `}
      {`
  @keyframes fadeInMessage {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-message {
    animation: fadeInMessage 1.5s ease-in-out forwards;
  }
`}
    </style>
      <StudentNav />

      <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8f9fa, #e3f2fd)' }}>
        <Typography variant="h4" align="center" sx={{ mb: 5, fontWeight: 700, color: '#0d47a1' }}>
          🎓 Student Dashboard
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* LEFT PANEL */}
          <Paper elevation={4} sx={{
            flex: 1,
            borderRadius: 4,
            p: 2,
            // backgroundColor: '#e8f5e9',
            background: 'linear-gradient(135deg,rgb(215, 234, 241),rgba(236, 215, 215, 0.24))',
            position: 'sticky',
            top: '0',
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
            
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0d47a1', textAlign: 'center'  }}>
              PROJECT TITLES
            </Typography>
            <Divider sx={{ mb: 2 , backgroundColor: 'rgba(121, 179, 233, 0.6)',}} />
            <List>
              {projects.map((project) => (
                <ListItem key={project._id} sx={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(247, 250, 253, 0.6)',
                    transform: 'scale(1.05)',
                  },
                  mb: 1,
                }}>
                  <ListItemButton
                    selected={expandedProject === project._id}
                    onClick={() => handleProjectClick(project._id)}
                    sx={{
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      boxShadow: expandedProject === project._id ? 3 : 1,
                      transition: 'all 0.3s ease',
                      padding: '10px 20px',
                      backgroundColor: 'rgba(121, 179, 233, 0.6)',
                    }}
                  >
                    <ListItemText primary={project.title} sx={{ textAlign: 'center', fontWeight: 600  }} />
                    <IconButton>
                      <ChevronRight sx={{ color: '#388e3c' }} />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* RIGHT PANEL */}
          <Paper
  elevation={4}
  className={animatePanel ? 'slide-in' : ''}
  sx={{
    flex: 2,
    borderRadius: 4,
    p: 4,
    // backgroundColor: '#e8f5e9',
      background: 'linear-gradient(135deg,rgb(224, 234, 238),rgba(240, 226, 226, 0.24))',
    width: '100%',
    maxWidth: 800,
    
  }}
>
  {selectedProject ? (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: '#1a237e',
          textAlign: 'center',
          
        }}
      >
         {selectedProject.title.toUpperCase()}
      </Typography>
     
      <Divider sx={{ mb: 1 }} />
      <Box
  sx={{

    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    flexWrap: 'wrap', // allow wrapping
    justifyContent: 'center',
  }}
>
  {['overview', 'technologies', 'features', 'objective', 'frontend', 'backend'].map((section) => (
    <Card
      key={section}
      className={animatePanel ? 'slide-in1' : ''}
      sx={{
        mt:1,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundImage: `url("/studentdashb.png")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'black',
        boxShadow: 2,
        width: {
          xs: '100%',     // full width on small screens
          sm: '45%',       // 2 cards per row on small/medium
          md: '30%',       // 3 cards per row on medium+
        },
        minWidth: 300,
      }}
    >
      
      <CardHeader
        title={section.charAt(0).toUpperCase() + section.slice(1)}
        sx={{
          backgroundColor: 'rgba(121, 179, 233, 0.6)',
          fontWeight: 600,
          textAlign:"center"
        }}
      />
      <CardContent
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <Typography variant="body2">
      {section === 'frontend' || section === 'backend'
        ? selectedProject[section] || 'Not Provided'
        : selectedProject.fullDesc?.[section] || 'Not Provided'}
    </Typography>
      </CardContent>
    </Card>
  ))}
</Box>


      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: 8,
            px: 5,
            py: 1.5,
            backgroundColor: selectedProjectId === selectedProject._id ? '#388e3c' : '#1976d2',
            '&:hover': {
              backgroundColor: selectedProjectId === selectedProject._id ? '#2e7d32' : '#1565c0',
            },
            boxShadow: 3,
            transition: 'all 0.2s ease-in-out',
          }}
          disabled={selectedProjectId && selectedProjectId !== selectedProject._id}
          onClick={() => handleSelect(selectedProject._id)}
        >
          {selectedProjectId === selectedProject._id ? '✅ Selected' : 'Select'}
        </Button>
      </Box>
    </>
  ) : (
    // <Typography variant="h6" color="black" align="center">
    //   👉 Please select a project from the left to view details.
    // </Typography>

   <Paper
  elevation={4}
  className="fade-in-message"
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '120px',
    mt:11,
    backgroundImage:  `url("/studentdashb2.png")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 9,
    p: 3,
    boxShadow: 3,
    textAlign: 'center',
    color: '#1a237e',
    fontWeight: 600,
    fontSize: '1.2rem',
    backgroundColor: 'rgba(255,255,255,0.7)', // for fallback blur effect
   
  }}
>
     Please select a project from the left to view details.
</Paper>


  )}
</Paper>

        </Box>
      </Box>
    </>
  );
};

export default StudentDashboard;