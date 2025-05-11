import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Link,
  Fade,
  IconButton,
  Stack,
  Zoom,
  Grow,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: 'Task Management App',
      description: 'A task management app with a React.js and Material UI frontend, backed by Node.js, Express, and MongoDB for task tracking and management.',
      color: '#2196f3',
      image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'E-Commerce Website',
      description: 'An e-commerce website built with React.js, Redux, and Material UI on the frontend, and Node.js, Express, and MongoDB powering the backend.',
      color: '#4caf50',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: 'Chat Application',
      description: 'A real-time chat application with a React.js and Tailwind CSS frontend, and a Node.js, Express, and Socket.io backend for seamless messaging',
      color: '#ff9800',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Online Learning Portal',
      description: 'An online learning platform with a React.js and Bootstrap frontend, and a Node.js, Express, and MongoDB backend for managing online courses.',
      color: '#9c27b0',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <Box sx={{ 
      flexGrow: 1,
      background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.05,
        zIndex: 0,
      }
    }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ 
        backgroundColor: '#1976d2', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/ICT_Academy_Kerala.webp"
            alt="ICT Academy Kerala Logo"
            sx={{ 
              height: 40, 
              mr: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Button 
            component="a"
            href="/"
            sx={{ 
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: 'white',
                transition: 'width 0.3s ease',
              },
              '&:hover::after': {
                width: '100%',
              }
            }}
          >
            Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component="a"
            href="/logincontroller"
            sx={{
              backgroundColor: 'white',
              color: '#1976d2',
              fontWeight: 600,
              fontSize: '16px',
              padding: '8px 24px',
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Carousel */}
      <Box sx={{ mt: 0 }}>
        <Carousel
          animation="fade"
          interval={5000}
          indicators={true}
          navButtonsAlwaysVisible={true}
          sx={{
            '& .MuiButtonBase-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.1)',
              }
            }
          }}
        >
          {carouselItems.map((item, i) => (
            <Paper key={i} sx={{ height: { xs: '300px', md: '500px' }, position: 'relative' }}>
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Paper>
          ))}
        </Carousel>
      </Box>

      {/* Scroll Indicator */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 2,
        animation: 'bounce 2s infinite'
      }}>
        <KeyboardArrowDownIcon sx={{ 
          fontSize: 40, 
          color: 'primary.main',
          opacity: 0.7,
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(0)',
            },
            '40%': {
              transform: 'translateY(-20px)',
            },
            '60%': {
              transform: 'translateY(-10px)',
            },
          }
        }} />
      </Box>

      {/* Cards Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
            }
          }}
        >
          Our Projects
        </Typography>
        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          sx={{
            '& .MuiGrid-item': {
              width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' },
              maxWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' },
              minWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' }
            }
          }}
        >
          {cards.map((card, index) => (
            <Grid item key={index}>
              <Grow in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card sx={{ 
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    '& .card-image': {
                      transform: 'scale(1.1)',
                    }
                  }
                }}>
                  <Box sx={{ 
                    width: '100%',
                    height: 200,
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    <Box
                      component="img"
                      src={card.image}
                      alt={card.title}
                      className="card-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to bottom, ${card.color}15, ${card.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Box sx={{ 
                        color: card.color,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        p: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}>
                        {card.icon}
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ 
                    width: '100%',
                    height: 200,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 2,
                        height: 28,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Box sx={{ 
                      flex: 1,
                      overflow: 'hidden',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '40px',
                        background: 'linear-gradient(transparent, white)',
                        pointerEvents: 'none'
                      }
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.6,
                          height: '100%',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'primary.main',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800, #9c27b0)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/a/ab/ICT_Academy_Kerala.webp"
                alt="ICT Academy Kerala Logo"
                sx={{ 
                  height: 40,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} ICT Academy Kerala
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={3}
              divider={<Box sx={{ width: 1, height: 16, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
            >
              {[
                { icon: FacebookIcon, label: 'Facebook' },
                { icon: TwitterIcon, label: 'Twitter' },
                { icon: LinkedInIcon, label: 'LinkedIn' },
                { icon: InstagramIcon, label: 'Instagram' }
              ].map(({ icon: Icon, label }, index) => (
                <Tooltip key={index} title={label}>
                  <IconButton 
                    color="inherit" 
                    size="small"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {Icon && <Icon />}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 