import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Add, School, Event, Person } from '@mui/icons-material';

const Training = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Leadership Excellence Program',
      type: 'Leadership',
      instructor: 'Dr. Sarah Johnson',
      duration: '40 hours',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
      participants: 15,
      maxParticipants: 20,
      status: 'active',
      format: 'hybrid'
    },
    {
      id: 2,
      title: 'Advanced React Development',
      type: 'Technical',
      instructor: 'Mike Chen',
      duration: '24 hours',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      participants: 12,
      maxParticipants: 15,
      status: 'completed',
      format: 'online'
    },
    {
      id: 3,
      title: 'Communication Skills Workshop',
      type: 'Soft Skills',
      instructor: 'Emma Wilson',
      duration: '16 hours',
      startDate: '2024-12-22',
      endDate: '2024-12-23',
      participants: 8,
      maxParticipants: 25,
      status: 'planned',
      format: 'offline'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'planned': return 'warning';
      default: return 'default';
    }
  };

  const getProgress = (participants, maxParticipants) => {
    return (participants / maxParticipants) * 100;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Training & Development</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Create Training
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Trainings" />
        <Tab label="My Enrollments" />
        <Tab label="Calendar" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {trainings.map((training) => (
            <Grid item xs={12} md={6} lg={4} key={training.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" gutterBottom>
                      {training.title}
                    </Typography>
                    <Chip 
                      label={training.status} 
                      color={getStatusColor(training.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <School fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {training.type}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {training.instructor}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Event fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {training.duration} hours
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" mb={1}>
                    {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                  </Typography>
                  
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">
                        Enrollment: {training.participants}/{training.maxParticipants}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(getProgress(training.participants, training.maxParticipants))}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getProgress(training.participants, training.maxParticipants)} 
                    />
                  </Box>
                  
                  <Chip 
                    label={training.format} 
                    variant="outlined" 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button variant="outlined" size="small" fullWidth>
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              My Training Enrollments
            </Typography>
            <List>
              <ListItem>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <School />
                </Avatar>
                <ListItemText
                  primary="Leadership Excellence Program"
                  secondary="In Progress - 60% Complete"
                />
                <Button variant="outlined" size="small">Continue</Button>
              </ListItem>
              <ListItem>
                <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                  <School />
                </Avatar>
                <ListItemText
                  primary="Advanced React Development"
                  secondary="Completed - Certificate Available"
                />
                <Button variant="contained" size="small">View Certificate</Button>
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Training Progress
              </Typography>
              <Box mb={2}>
                <Typography variant="body2">Completed: 3</Typography>
                <LinearProgress variant="determinate" value={60} sx={{ mt: 1 }} />
              </Box>
              <Box mb={2}>
                <Typography variant="body2">In Progress: 2</Typography>
                <LinearProgress variant="determinate" value={40} sx={{ mt: 1 }} />
              </Box>
              <Typography variant="body2">
                Total Training Hours: 120
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Training Program</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Training Title"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Training Type</InputLabel>
                <Select label="Training Type">
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="soft_skills">Soft Skills</MenuItem>
                  <MenuItem value="leadership">Leadership</MenuItem>
                  <MenuItem value="compliance">Compliance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Format</InputLabel>
                <Select label="Format">
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Maximum Participants"
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Create Training</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Training;
