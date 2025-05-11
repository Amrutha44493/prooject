import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Divider
} from "@mui/material";
import {
  Link as LinkIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const WeeklyMaterials = () => {
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWeeks, setFilteredWeeks] = useState([]);
  const [weekDetails, setWeekDetails] = useState({});
  const [projectId, setProjectId] = useState(null);

  // Fetch student's project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const studentId = decoded?.student?.id;
        const res = await axios.get(`http://localhost:5000/api/projects/student/${studentId}`);
        setProjectId(res.data._id);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchProject();
  }, []);

  // Fetch reference materials
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!projectId) return;
      try {
        const { data } = await axios.get(`http://localhost:5000/api/reference/${projectId}`);
        const cleanedWeeks = data.referenceMaterials.map(item => ({
          ...item,
          title: item.title.replace(`Week ${item.week}:`, '').trim()
        }));
        const uniqueWeeks = [...new Map(cleanedWeeks.map(item => [item.week, item])).values()]
          .sort((a, b) => a.week - b.week);
        setAvailableWeeks(uniqueWeeks);
        setFilteredWeeks(uniqueWeeks);
      } catch (err) {
        console.error("Error fetching reference materials:", err);
      }
    };
    fetchMaterials();
  }, [projectId]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredWeeks(
      value ? availableWeeks.filter(week => week.week.toString() === value) : availableWeeks
    );
  };

  const handleAccordionChange = async (weekNumber) => {
    if (!weekDetails[weekNumber]) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/reference/${projectId}`);
        const weekData = data.referenceMaterials.find(item => item.week === weekNumber);
        if (weekData) setWeekDetails(prev => ({ ...prev, [weekNumber]: weekData }));
      } catch (err) {
        console.error(`Error fetching week ${weekNumber} details:`, err);
      }
    }
  };

  const renderContent = (weekDetail) => (
    <Paper sx={{
      p: 2,
      mt: 1,
      backgroundColor: '#f7f8f9',
      borderLeft: '4px solid #b4b8bc'
    }}>
      <Typography variant="body1" paragraph>
        {weekDetail.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {weekDetail.submissionType === 'link' && weekDetail.link ? (
        <Button
          href={weekDetail.link}
          target="_blank"
          startIcon={<LinkIcon />}
          sx={{ color: '#1976d2' }}
        >
          Reference Link
        </Button>
      ) : weekDetail.submissionType === 'file' && weekDetail.cloudinaryUrl ? (
        <Button
          href={weekDetail.cloudinaryUrl}
          target="_blank"
          startIcon={<DownloadIcon />}
          sx={{ color: '#1976d2' }}
          download
        >
          Download Material
        </Button>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No materials available for this week
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        p: 3, 
        borderRadius: 2, 
        boxShadow: 3, 
        bgcolor: 'background.paper',
        mt: 8,
        width: '95%',
        maxWidth: '950px',
        mx: 'auto'
      }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
          </Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Select Week</InputLabel>
            <Select
              value={searchTerm}
              onChange={handleSearch}
              label="Select Week"
            >
              <MenuItem value="">All Weeks</MenuItem>
              {availableWeeks.map((week) => (
                <MenuItem key={week.week} value={week.week.toString()}>
                  Week {week.week}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {filteredWeeks.length === 0 ? (
          <Typography>No reference materials available</Typography>
        ) : (
          filteredWeeks.map((week) => (
            <Accordion 
              key={week.week} 
              onChange={() => handleAccordionChange(week.week)}
              sx={{ 
                mb: 1.5,
                backgroundColor: 'rgba(48,117,137,255)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(38,107,127,255)'
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Week {week.week}: {week.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {weekDetails[week.week] ? (
                  renderContent(weekDetails[week.week])
                ) : (
                  <Typography>Loading materials...</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
};

export default WeeklyMaterials;