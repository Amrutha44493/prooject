import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';

const Home = () => {
  const carouselItems = [
    {
      image: 'https://ictkerala.org/uploads/2025/03/GRA_Landing-Jobs-1.png',
      title: 'First Slide',
      description: 'First slide description',
    },
    {
      image: 'https://ictkerala.org/uploads/2025/03/GRA_Landing-Contests.png',
      title: 'Second Slide',
      description: 'Second slide description',
    },
    {
      image: 'https://ictkerala.org/uploads/2025/03/ICTAK-Website-elevateHER-Banner.png',
      title: 'Third Slide',
      description: 'Third slide description',
    },
  ];

  const cards = [
    {
      image: 'https://images.squarespace-cdn.com/content/v1/5f95a2988b73fb2d14874ce3/1628545212710-X8BUBW4U2WTL36719HLM/Prod+Apps+Collage.png',
      title: 'Task Management App',
      description: 'A task management app with a React.js and Material UI frontend, backed by Node.js, Express, and MongoDB for seamless task tracking and management.',
    },
    {
      image: 'https://www.neelnetworks.com/blog/wp-content/uploads/2020/10/E-Commerce-Website.jpg',
      title: 'E-Commerce Website',
      description: 'An e-commerce website built with React.js, Redux, and Material UI on the frontend, and Node.js, Express, and MongoDB powering the backend for efficient product management and transactions.onstrate the layout',
    },
    {
      image: 'https://www.mindinventory.com/blog/wp-content/uploads/2022/10/chat-app.jpg',
      title: 'Chat Application',
      description:'A real-time chat application with a React.js and Tailwind CSS frontend, and a Node.js, Express, and Socket.io backend for seamless messaging',
    },
    {
      image: 'https://www.scnsoft.com/education-industry/elearning-portal/elearning-portals-cover-picture.svg',
      title: 'Online Learning Portal',
      description: 'An online learning platform with a React.js and Bootstrap frontend, and a Node.js, Express, and MongoDB backend for managing courses, users, and content delivery',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/ICT_Academy_Kerala.webp"
            alt="ICT Academy Kerala Logo"
            sx={{ height: 40, mr: 2 }}
          />
          <Button 
            component="a"
            href="/"
            sx={{ 
              color: 'white',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#f0f0f0'
              }
            }}
          >
            Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component="a"
            href="/login"
            sx={{
              border: '2px solid #437EF7',
              backgroundColor: '#ffffff',
              color: '#437EF7',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19.36px',
              padding: '8px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#437EF7',
                color: '#ffffff',
                border: '2px solid #437EF7'
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Carousel */}
      <Box sx={{ mt: 0 }}>
        <Carousel>
          {carouselItems.map((item, i) => (
            <Paper key={i} sx={{ height: '400px', position: 'relative' }}>
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          ))}
        </Carousel>
      </Box>

      {/* Cards Section */}
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 3,
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {cards.map((card, index) => (
            <Card key={index} sx={{ 
              height: '320px',
              width: '250px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}>
              <CardMedia
                component="img"
                height="140"
                image={card.image}
                alt={card.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="body1">
              © {new Date().getFullYear()} ICT Academy Kerala. All rights reserved.
            </Typography>
            <Box sx={{ 
              display: 'flex',
              gap: 3
            }}>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact Us
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 