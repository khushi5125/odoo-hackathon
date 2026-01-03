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
  Rating,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { Add, Assessment } from '@mui/icons-material';

const Performance = () => {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      employee: 'John Doe',
      period: 'Q4 2024',
      type: 'Quarterly',
      score: 4.2,
      status: 'completed',
      date: '2024-12-01'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      period: 'Q4 2024',
      type: 'Quarterly',
      score: 3.8,
      status: 'in_progress',
      date: '2024-12-05'
    }
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Performance Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          New Review
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Performance Reviews
          </Typography>
          {reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{review.employee}</Typography>
                    <Typography color="textSecondary">
                      {review.period} - {review.type}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Rating value={review.score} precision={0.1} readOnly />
                    <Typography variant="body2" color="textSecondary">
                      {review.score}/5.0
                    </Typography>
                    <Chip 
                      label={review.status} 
                      color={review.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Average Score" 
                  secondary="4.0 / 5.0" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Completed Reviews" 
                  secondary="24 / 30" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Pending Reviews" 
                  secondary="6" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Top Performers" 
                  secondary="5 employees" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create Performance Review</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Employee</InputLabel>
                <Select label="Employee">
                  <MenuItem value="john">John Doe</MenuItem>
                  <MenuItem value="jane">Jane Smith</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Review Type</InputLabel>
                <Select label="Review Type">
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="probation">Probation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review Period"
                type="month"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Goals & Objectives
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Goals for this period"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Competency Rating
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography>Communication Skills</Typography>
                  <Rating name="communication" />
                </Box>
                <Box>
                  <Typography>Teamwork</Typography>
                  <Rating name="teamwork" />
                </Box>
                <Box>
                  <Typography>Leadership</Typography>
                  <Rating name="leadership" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Strengths"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Areas for Improvement"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Create Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Performance;
