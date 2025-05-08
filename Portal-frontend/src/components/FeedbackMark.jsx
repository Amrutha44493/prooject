import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Fade,
  Chip,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';
import GradeIcon from '@mui/icons-material/Grade';

const FeedbackMarks = () => {
  const [weeklySubmissions, setWeeklySubmissions] = useState([]);
  const [projectReport, setProjectReport] = useState(null);
  const [viva, setViva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarksData = async () => {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        console.error("Student ID not found in localStorage.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/getSubmission/${studentId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        const data = response.data;
        setWeeklySubmissions(data.weeklySubmissionData || []);
        setProjectReport(data.finalProjectReport || null);
        setViva(data.vivaVoce || null);
      } catch (error) {
        console.error("Error fetching marks and comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarksData();
  }, []);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const getProgressColor = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const renderTable = (title, dataArray, isSingleRow = false) => {
    const isEmpty =
      !dataArray ||
      (isSingleRow && Object.keys(dataArray).length === 0) ||
      (Array.isArray(dataArray) && dataArray.length === 0);

    if (isEmpty) {
      return (
        <Fade in={true}>
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                {title === "Weekly Submissions" && <AssignmentIcon color="primary" />}
                {title === "Project Report" && <DescriptionIcon color="primary" />}
                {title === "Viva Voce" && <RecordVoiceOverIcon color="primary" />}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {title}
                </Typography>
              </Stack>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                No submission done yet
              </Alert>
            </CardContent>
          </Card>
        </Fade>
      );
    }

    return (
      <Fade in={true}>
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              {title === "Weekly Submissions" && <AssignmentIcon color="primary" />}
              {title === "Project Report" && <DescriptionIcon color="primary" />}
              {title === "Viva Voce" && <RecordVoiceOverIcon color="primary" />}
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {title}
              </Typography>
            </Stack>
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                      TYPE
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                      DATE
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                      MARKS
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                      MENTOR COMMENT
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                      SUBMISSION
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isSingleRow
                    ? renderSubmissionRow(title, dataArray)
                    : dataArray.map((item, index) =>
                        renderSubmissionRow(`Week ${index + 1}`, item, index)
                      )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const renderSubmissionRow = (typeLabel, submission, key = null) => {
    let maxMarks = 10;
    if (typeLabel === "Project Report") maxMarks = 30;
    if (typeLabel === "Viva Voce") maxMarks = 30;

    const submissionDate =
      typeLabel === "Project Report"
        ? submission?.submissionDate
        : submission?.createdAt;

    const marks = submission?.marks || 0;
    const progressColor = getProgressColor(marks, maxMarks);

    return (
      <TableRow 
        key={key}
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            transition: 'background-color 0.2s'
          }
        }}
      >
        <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)", textAlign: "center" }}>
          <Chip 
            label={typeLabel}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)", textAlign: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {formatDate(submissionDate)}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)", textAlign: "center" }}>
          <Stack spacing={1} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <GradeIcon color={progressColor} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {!submission || marks === 0
                  ? "Not graded yet"
                  : `${marks} / ${maxMarks}`}
              </Typography>
            </Stack>
            {marks > 0 && (
              <LinearProgress 
                variant="determinate" 
                value={(marks / maxMarks) * 100} 
                color={progressColor}
                sx={{ width: '80%', height: 6, borderRadius: 3 }}
              />
            )}
          </Stack>
        </TableCell>
        <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)", textAlign: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <CommentIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {submission?.mentorComment || "No comments yet"}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {submission?.submissionType === "link" ? (
            <Tooltip title="View Link">
              <IconButton
                href={submission.link}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          ) : submission?.cloudinaryUrl ? (
            <Tooltip title="View File">
              <IconButton
                href={submission.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Chip 
              label="No submission" 
              size="small" 
              color="default" 
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)'
      }}>
        <LinearProgress sx={{ width: '50%', height: 6, borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
        p: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            borderRadius: 3,
            width: "95%",
            maxWidth: "1200px",
            backgroundColor: "#fff",
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "primary.main",
                fontWeight: 700,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Marks and Feedback
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {renderTable("Weekly Submissions", weeklySubmissions)}
            {renderTable("Project Report", projectReport, true)}
            {renderTable("Viva Voce", viva, true)}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default FeedbackMarks;

