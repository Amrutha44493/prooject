import React from 'react';
import AddSubmission from '../WeeklySubmission/AddSubmission'
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WeeklySubmissionFormat = () => {
  const navigate = useNavigate();

  // const handleAddSubmissionClick = () => {
  //   navigate('/addsubmission');
  // };

  return (
    <div>
      {/* <AddSubmission /> */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Weekly Submission Report Format
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please structure your weekly report as per the following format:
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Week Number"
              secondary="Specify the current week (e.g., Week 1, Week 2)"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Objectives"
              secondary="Mention what you planned to accomplish during the week"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Work Done"
              secondary="Summarize the actual tasks or work completed"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Learnings"
              secondary="Mention what you learned this week"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Supporting Material"
              secondary="Provide GitHub links, uploaded files, or screenshots"
            />
          </ListItem>
        </List>
      </Paper>

      {/* <Button
        variant="contained"
        sx={{ mt: 2 , justifyContent:"center"}}
        onClick={handleAddSubmissionClick}
      >
        Add Submission
      </Button> */}
    </div>
  );
};

export default WeeklySubmissionFormat;

