import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


const StudentNav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate("/login")
  };
  return (
   <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <img 
            src="/logo.png" 
            alt="ICTAK Logo" 
            style={{ width: 40, height: 40, marginRight: 13 }} 
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ICTAK - Internship Portal
          </Typography>
          <Button color="outlined" sx={{ 
              color: '#fff', 
              borderColor: '#fff',
              borderRadius: 2,
              paddingX: 2,
              '&:hover': {
                backgroundColor: '#fff',
                color: '#1976d2',
                borderColor: '#fff',
              }
            }} onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  
  )
}

export default StudentNav
