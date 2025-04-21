import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid
} from '@mui/material';
// import Overview from '../components/ProjectDashboard/Overview';
// import WeeklyMaterials from '../components/ProjectDashboard/WeeklyMaterials';
// import WeeklySubmission from '../components/ProjectDashboard/WeeklySubmission';
// import FinalReport from '../components/ProjectDashboard/FinalReport';
// import VivaVoce from '../components/ProjectDashboard/VivaVoce';
// import DiscussionForum from '../components/ProjectDashboard/DiscussionForum';
// import Feedback from '../components/ProjectDashboard/Feedback';

const ProjectDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

          {/* <Box sx={{ mt: 3 }}>
            {value === 0 && <Overview />}
            {value === 1 && <WeeklyMaterials />}
            {value === 2 && <WeeklySubmission />}
            {value === 3 && <FinalReport />}
            {value === 4 && <VivaVoce />}
            {value === 5 && <DiscussionForum />}
            {value === 6 && <Feedback />}
          </Box> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProjectDashboard;


