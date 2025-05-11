import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from "@mui/material";
import StudentNav from "./StudentNav";
import Overview from "../components/ProjectDashboard/Overview";
import WeeklyMaterials from "./WeeklyMaterials";
import WeeklySubmission from "../components/WeeklySubmission"; 
import VivaVoce from "./VivaVoce";
import FinalProjectSubmission from "./FinalProjectSubmission";
import DiscussionForum from "./DiscussionForum";
import { useParams } from 'react-router-dom';
import FeedbackMark from "./FeedbackMark";
const ProjectDashboard = () => {
  const { projectId: projectIdFromRoute } = useParams();
  const [value, setValue] = useState(0);
  const [projectId, setProjectId] = useState(projectIdFromRoute);

  useEffect(() => {
    console.log("ProjectDashboard projectId:", projectId);
  }, [projectId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <StudentNav />
      <Box sx={{ p: 3 }}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Project Dashboard
          </Typography>

          <Tabs
            value={value}
            onChange={handleChange}
            scrollButtons="auto"
            variant="fullWidth"
          >
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
            {value === 1 && <WeeklyMaterials />}
            {value === 2 && <WeeklySubmission />} {}
            {value === 3 && <FinalProjectSubmission />}
            {value === 4 && <VivaVoce />}
            {value === 5 && <DiscussionForum />}

            {value === 6 && <FeedbackMark />} 
          </Box>
        </Paper>
      </Box>
      <Typography
                  disabled={isWeekend}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    color: "warning.main",
                  }}
                >
                  <WarningAmberIcon sx={{pr:1}}/>  Weekly submission will be available only
                  during weekends.
                </Typography>
    </div>
  );
};

export default ProjectDashboard;
