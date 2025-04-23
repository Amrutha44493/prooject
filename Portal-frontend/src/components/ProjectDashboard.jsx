import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Grid
} from '@mui/material';
import WeeklySubmissionFormat from "./WeeklySubmission/WeeklySubmissionFormat";
import AddSubmission from "./WeeklySubmission/AddSubmission";
import StudentNav from './StudentNav';
import Overview from '../components/ProjectDashboard/Overview';

// import Overview from '../components/ProjectDashboard/Overview';
// import WeeklyMaterials from '../components/ProjectDashboard/WeeklyMaterials';
// import WeeklySubmission from '../components/ProjectDashboard/WeeklySubmission';
// import FinalReport from '../components/ProjectDashboard/FinalReport';
// import VivaVoce from '../components/ProjectDashboard/VivaVoce';
// import DiscussionForum from '../components/ProjectDashboard/DiscussionForum';
// import Feedback from '../components/ProjectDashboard/Feedback';

const ProjectDashboard = () => {
  const today = new Date().getDay();
  const isWeekend = today === 2 || today === 3; // true if Saturday or Sunday

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
    <div>
      <StudentNav/>
    {/* <Grid container justifyContent="center" sx={{ p: 2 }}>
      <Grid item xs={12} md={10}> */}
       <Box sx={{ p: 3 }}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Project Dashboard
          </Typography>

          <Tabs value={value} onChange={handleChange}  scrollButtons="auto" variant="fullWidth">
            <Tab label="Overview" />
            <Tab label="Weekly Materials" />
            <Tab label="Weekly Submission" />
            <Tab label="Final Report" />
            <Tab label="Viva Voce" />
            <Tab label="Discussion Forum" />
            <Tab label="Feedback / Marks" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
          {value === 0 && <Overview />}
            {value === 2 && !isAddSubmission && (
              <div>
                <WeeklySubmissionFormat />
                {isWeekend && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleAddSubmissionClick}
                    >
                      Add Submission
                    </Button>
                  </Box>
                )}
              </div>
            )}
            {value === 2 && isAddSubmission && (
              <div>
                <AddSubmission />
                <Box sx={{ display: "flex", justifyContent: "center", mb:2 }}>
                  <Button variant="outlined" onClick={handleBackClick}>
                    Back to Weekly Submission
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        </Paper>
        </Box>
      {/* </Grid>
    </Grid> */}
    </div>
  );
};

export default ProjectDashboard;
