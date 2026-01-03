import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Pagination
} from '@mui/material';
import { AccessTime, LocationOn, CheckCircle, Cancel } from '@mui/icons-material';

const Attendance = () => {
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [checkOutDialog, setCheckOutDialog] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mockAttendance = [
    {
      id: 1,
      employee: 'John Doe',
      employeeId: 'EMP001',
      date: '2024-12-01',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      totalHours: '9h 00m',
      status: 'present',
      location: 'Office'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      employeeId: 'EMP002',
      date: '2024-12-01',
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      totalHours: '9h 15m',
      status: 'late',
      location: 'Office'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      employeeId: 'EMP003',
      date: '2024-12-01',
      checkIn: '-',
      checkOut: '-',
      totalHours: '0h 00m',
      status: 'absent',
      location: '-'
    }
  ];

  useEffect(() => {
    setAttendance(mockAttendance);
    setTotalPages(1);
  }, []);

  const handleCheckIn = () => {
    setCheckInDialog(true);
  };

  const handleCheckOut = () => {
    setCheckOutDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'half_day': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Attendance Management</Typography>
        <Box>
          <Button variant="contained" color="success" onClick={handleCheckIn} sx={{ mr: 2 }}>
            Check In
          </Button>
          <Button variant="contained" color="warning" onClick={handleCheckOut}>
            Check Out
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Present Today
              </Typography>
              <Typography variant="h4">
                {attendance.filter(a => a.status === 'present').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Late
              </Typography>
              <Typography variant="h4">
                {attendance.filter(a => a.status === 'late').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Absent
              </Typography>
              <Typography variant="h4">
                {attendance.filter(a => a.status === 'absent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Half Day
              </Typography>
              <Typography variant="h4">
                {attendance.filter(a => a.status === 'half_day').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Attendance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {record.employee}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {record.employeeId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationOn fontSize="small" sx={{ mr: 1 }} />
                        {record.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status.replace('_', ' ')} 
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <AccessTime />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)}>
        <DialogTitle>Check In</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Current Time: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date: {new Date().toLocaleDateString()}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Location</InputLabel>
              <Select label="Location" defaultValue="office">
                <MenuItem value="office">Office</MenuItem>
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="client">Client Location</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setCheckInDialog(false)}>
            Check In
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={checkOutDialog} onClose={() => setCheckOutDialog(false)}>
        <DialogTitle>Check Out</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Current Time: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Hours Today: 9h 15m
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Location</InputLabel>
              <Select label="Location" defaultValue="office">
                <MenuItem value="office">Office</MenuItem>
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="client">Client Location</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckOutDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setCheckOutDialog(false)}>
            Check Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attendance;
