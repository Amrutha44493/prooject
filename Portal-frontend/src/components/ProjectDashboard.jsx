import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Paper, Button, Grid } from "@mui/material";
import WeeklySubmissionFormat from "./WeeklySubmission/WeeklySubmissionFormat";
import AddSubmission from "./WeeklySubmission/AddSubmission";
import StudentNav from "./StudentNav";
import Overview from "../components/ProjectDashboard/Overview";
import WeeklyMaterials from "./WeeklyMaterials";
import VivaVoce from "./VivaVoce";
import FinalProjectSubmission from "./FinalProjectSubmission"; // Import the component
import { useParams } from 'react-router-dom'; // Import useParams
import FeedbackMark from "./FeedbackMark";

import DiscussionForum from "./DiscussionForum";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
const ProjectDashboard = () => {
    const today = new Date().getDay();
    const isWeekend = today === 6 || today === 0;
    const { projectId: projectIdFromRoute } = useParams(); // Get projectId from URL
    const [value, setValue] = useState(0);
    const [isAddSubmission, setIsAddSubmission] = useState(false);
    const [projectId, setProjectId] = useState(projectIdFromRoute); // Set projectId from route param

    useEffect(() => {
        console.log("ProjectDashboard projectId:", projectId);
        // You can add logic here to fetch project details if needed
        // based on the projectId. For example:
        // axios.get(`/api/projects/${projectId}`, { ... })
        //   .then(response => {
        //     // Set project details in state if needed for other components
        //   })
        //   .catch(error => {
        //     console.error("Error fetching project details in Dashboard:", error);
        //   });
    }, [projectId]);

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
                        <Tab label="Final Report" /> {/* Add the Final Report Tab */}
                        <Tab label="Viva Voce" />
                        <Tab label="Discussion Forum" />
                        <Tab label="Feedback / Marks" />
                    </Tabs>

                    <Box sx={{ mt: 3 }}>
                        {value === 0 && <Overview />} {/* Overview will fetch its own data */}
                        {value === 1 && <WeeklyMaterials />}

                        {value === 2 && !isAddSubmission && (
                            <div>
                                <WeeklySubmissionFormat />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        disabled={!isWeekend}
                                        onClick={handleAddSubmissionClick}
                                    >
                                        Add Submission
                                    </Button>
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
                        )}
                        {value === 2 && isAddSubmission && (
                            <div>
                                <AddSubmission />
                                <Box
                                    disabled={!isWeekend}
                                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                                >
                                    <Button variant="outlined" onClick={handleBackClick}>
                                        Back to Weekly Submission
                                    </Button>
                                </Box>
                            </div>
                        )}
                        {value === 3 && (
                            <FinalProjectSubmission />
                        )} {/* Render FinalProjectSubmission without passing projectId */}
                        {value === 4 && <VivaVoce />}
                        {value === 5 && <DiscussionForum />}
                        {value === 6 && <FeedbackMark />} 
                       
                    </Box>
                </Paper>
            </Box>
        </div>
    );
  //           {value === 2 && !isAddSubmission && (
  //             <div>
  //               <WeeklySubmissionFormat />
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   justifyContent: "center",
  //                   mt: 1,
  //                   mb: 2,
  //                 }}
  //               >
  //                 <Button
  //                   variant="contained"
  //                   disabled={!isWeekend}
  //                   onClick={handleAddSubmissionClick}
  //                 >
  //                   Add Submission
  //                 </Button>
  //               </Box>
  //               <Typography
  //                 disabled={isWeekend}
  //                 sx={{
  //                   display: "flex",
  //                   justifyContent: "center",
  //                   color: "warning.main",
  //                 }}
  //               >
  //                 <WarningAmberIcon sx={{pr:1}}/>  Weekly submission will be available only
  //                 during weekends.
  //               </Typography>
  //               {/* {isWeekend && (
  //                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1,mb:2, }}>
  //                   <Button
  //                     variant="contained"
  //                     onClick={handleAddSubmissionClick}
  //                   >
  //                     Add Submission
  //                   </Button>
  //                 </Box>
  //               )} */}
  //             </div>
  //           )}
  //           {value === 2 && isAddSubmission && (
  //             <div>
  //               <AddSubmission />
  //               <Box
  //                 disabled={!isWeekend}
  //                 sx={{ display: "flex", justifyContent: "center", mb: 2 }}
  //               >
  //                 <Button variant="outlined" onClick={handleBackClick}>
  //                   Back to Weekly Submission
  //                 </Button>
  //               </Box>
  //             </div>
  //           )}
  //           {value === 4 && <VivaVoce />}
  //           {value === 5 && <DiscussionForum />}
  //         </Box>
  //     {/* </Grid>
  //   </Grid> */}
  //   </div>
  // );
};

export default ProjectDashboard;