import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Box,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import axios from 'axios';

const WeeklyMaterials = () => {
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWeeks, setFilteredWeeks] = useState([]);
  const [weekDetails, setWeekDetails] = useState({});

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reference/weeks');
        if (Array.isArray(res.data)) {
          setAvailableWeeks(res.data);
          setFilteredWeeks(res.data);
        }
      } catch (err) {
        console.error('Error fetching weeks:', err);
      }
    };

    fetchWeeks();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredWeeks(availableWeeks.filter((week) =>
      week.toString().includes(value)
    ));
  };

  const handleAccordionChange = async (weekNumber) => {
    if (!weekDetails[weekNumber]) {
      try {
        const res = await axios.get(`http://localhost:5000/api/reference/week/${weekNumber}`);
        if (res.data && res.data.length > 0) {
          const data = res.data[0];
          setWeekDetails((prevDetails) => ({
            ...prevDetails,
            [weekNumber]: data,
          }));
        }
      } catch (err) {
        console.error(`Error fetching details for week ${weekNumber}:`, err);
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Heading + Search Bar */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Weekly Reference Materials</Typography>
        <TextField
          label="Search Weeks"
          variant="outlined"
          size="small"
          placeholder="weeks like 1, 2..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ maxWidth: 200 }}
        />
      </Grid>

      {/* Accordion List */}
      {filteredWeeks.length === 0 ? (
        <Typography>No weeks available</Typography>
      ) : (
        filteredWeeks.map((weekNumber) => (
          <Accordion
            key={weekNumber}
            onChange={() => handleAccordionChange(weekNumber)}
            sx={{
              mb: 2,
              border: 'none',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#808080',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#000000',
                },
              }}
            >
              <Typography variant="h6">
                Week {weekNumber}: {weekDetails[weekNumber]?.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: '#f5f5f5',
                color: '#000',
              }}
            >
              {weekDetails[weekNumber] ? (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {weekDetails[weekNumber].description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {weekDetails[weekNumber].fileUrl.includes('.pdf') ? (
                      <PictureAsPdfIcon sx={{ color: '#d32f2f' }} />
                    ) : (
                      <VideoLibraryIcon sx={{ color: '#1976d2' }} />
                    )}
                    <a
                      href={weekDetails[weekNumber].fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#4caf50', wordBreak: 'break-all' }}
                    >
                      {weekDetails[weekNumber].fileUrl}
                    </a>
                  </Box>
                </>
              ) : (
                <Typography variant="body2">Loading.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default WeeklyMaterials;
