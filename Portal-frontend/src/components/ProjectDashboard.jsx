import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Button
} from '@mui/material';
import WeeklySubmissionFormat from './WeeklySubmission/WeeklySubmissionFormat';
import AddSubmission from './WeeklySubmission/AddSubmission';

const ProjectDashboard = () => {
  const today = new Date().getDay();
  const isWeekend = today === 6 || today === 1;  // true if Saturday or Sunday

  const [value, setValue] = useState(0);
  const [isAddSubmission, setIsAddSubmission] = useState(false); // To toggle between view

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddSubmissionClick = () => {
    setIsAddSubmission(true); // Set to true when "Add Submission" is clicked
  };

  const handleBackClick = () => {
    setIsAddSubmission(false); // Set to false to go back to Weekly Submission format
  };

  return (
    <Grid container justifyContent="center" sx={{ p: 2 }}>
      <Grid item xs={12} md={10}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Project Dashboard
          </Typography>

          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Overview" />
            <Tab label="Weekly Materials" />
            <Tab label="Weekly Submission" />
            <Tab label="Final Report" />
            <Tab label="Viva Voce" />
            <Tab label="Discussion Forum" />
            <Tab label="Feedback / Marks" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {value === 2 && !isAddSubmission && (
              <div>
                <WeeklySubmissionFormat />
                {isWeekend && (
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={handleAddSubmissionClick}>
                      Add Submission
                    </Button>
                  </Box>
                )}
              </div>
            )}
            {value === 2 && isAddSubmission && (
              <div>
                <AddSubmission />
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" onClick={handleBackClick}>
                    Back to Weekly Submission
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProjectDashboard;
