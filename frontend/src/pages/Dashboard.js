import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  People,
  AccessTime,
  EventNote,
  TrendingUp,
  School,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Employees', value: '156', icon: <People />, color: '#1976d2' },
    { title: 'Present Today', value: '142', icon: <AccessTime />, color: '#2e7d32' },
    { title: 'Leave Requests', value: '8', icon: <EventNote />, color: '#ed6c02' },
    { title: 'Performance Score', value: '4.2', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  const recentActivities = [
    { title: 'John Doe checked in', time: '2 mins ago', type: 'attendance' },
    { title: 'Leave request by Jane Smith', time: '15 mins ago', type: 'leave' },
    { title: 'Training session completed', time: '1 hour ago', type: 'training' },
    { title: 'Payroll processed for IT department', time: '2 hours ago', type: 'payroll' },
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', date: 'Today, 3:00 PM', type: 'meeting' },
    { title: 'Performance Review Deadline', date: 'Tomorrow', type: 'deadline' },
    { title: 'Training: Leadership Skills', date: 'Dec 15, 2024', type: 'training' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box sx={{ color: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="h2">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={activity.title}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={event.title}
                    secondary={event.date}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Overview
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Present: 91% | Absent: 5% | Leave: 4%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={91} 
                sx={{ mt: 1, height: 10, borderRadius: 5 }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                • Mark Attendance
              </Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                • Apply for Leave
              </Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                • View Payslip
              </Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                • Update Profile
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
