import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box
} from '@mui/material';
import AddSubmission from './AddSubmission';
import Link from '@mui/material/Link';

const WeeklySubmissionFormat = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, justifyContent:"center" }}>
      {!showForm ? (
        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          {/* <Typography variant="h5" gutterBottom>
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
          </List> */}
          <Link sx={{
                    display: "flex",
                    justifyContent: "center",
                    // mt: 1,
                    // mb: 2,
                  }} href="https://docs.google.com/document/d/1ZgudQFgjmyYYYGqoNkcVI6uBClM3xBPVrB345PtXkTM/edit?usp=sharing" target='_blank' underline="hover">
        {'Weekly Submission Format'}
      </Link>

          {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
            >
              Add Submission
            </Button>
          </Box> */}
        </Paper>
      ) : (
        <AddSubmission onBack={() => setShowForm(false)} />
      )}
    </Box>
  );
};

export default WeeklySubmissionFormat;

