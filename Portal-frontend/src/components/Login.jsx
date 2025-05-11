import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Alert,
} from '@mui/material';

const Login = ({onswitchForm}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post(
        'http://localhost:5000/api/auth/login', 
        { email, password },
        config
      );

      // Store the token and student ID in local storage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('studentId', res.data.studentId);

      if (res.data.hasProject) {
        navigate('/ProjectDashboard'); 
      } else {
        navigate('/dashboard'); 
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Login failed. Please try again.');
        console.error('Login error:', err);
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      // style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
      style={{ minHeight: '97vh'}}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Sign In
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#0099cc', '&:hover': { backgroundColor: '#29687d' } }}
            >
              Login
            </Button>
          </form>
          <Typography sx={{ mt: 2 }}>
            <Link to={'/logincontroller'} style={{ color: 'grey', textDecoration: 'none' }} onClick={(e) => {
              e.preventDefault();
              onswitchForm();
            }}>
             <i>New User? Click here</i> 
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;