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
  Pagination,
  Tabs,
  Tab
} from '@mui/material';
import { EventNote, Add, Check, Close } from '@mui/icons-material';

const Leave = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mockLeaveRequests = [
    {
      id: 1,
      employee: 'John Doe',
      employeeId: 'EMP001',
      type: 'annual',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-12-01',
      approvedBy: 'HR Manager'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      employeeId: 'EMP002',
      type: 'sick',
      startDate: '2024-12-10',
      endDate: '2024-12-11',
      days: 2,
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: '2024-12-09',
      approvedBy: null
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      employeeId: 'EMP003',
      type: 'personal',
      startDate: '2024-12-05',
      endDate: '2024-12-05',
      days: 1,
      reason: 'Personal work',
      status: 'rejected',
      appliedDate: '2024-12-04',
      approvedBy: 'HR Manager',
      rejectionReason: 'Insufficient notice period'
    }
  ];

  useEffect(() => {
    setLeaveRequests(mockLeaveRequests);
    setTotalPages(1);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'sick': return 'secondary';
      case 'personal': return 'info';
      case 'maternity': return 'success';
      case 'paternity': return 'warning';
      default: return 'default';
    }
  };

  const filteredRequests = tabValue === 0 
    ? leaveRequests 
    : leaveRequests.filter(req => req.status === ['pending', 'approved', 'rejected'][tabValue - 1]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Leave Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Apply for Leave
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Pending
              </Typography>
              <Typography variant="h4">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Approved
              </Typography>
              <Typography variant="h4">
                {leaveRequests.filter(r => r.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Rejected
              </Typography>
              <Typography variant="h4">
                {leaveRequests.filter(r => r.status === 'rejected').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Total Leave Days
              </Typography>
              <Typography variant="h4">
                {leaveRequests.reduce((sum, r) => sum + r.days, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Leave Requests
          </Typography>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Rejected" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {request.employee}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {request.employeeId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.type.charAt(0).toUpperCase() + request.type.slice(1)} 
                        color={getTypeColor(request.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {request.startDate} to {request.endDate}
                      </Typography>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {request.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>{request.appliedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        {request.status === 'pending' && (
                          <>
                            <IconButton size="small" color="success">
                              <Check />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Close />
                            </IconButton>
                          </>
                        )}
                        <IconButton size="small">
                          <EventNote />
                        </IconButton>
                      </Box>
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Leave Type</InputLabel>
                <Select label="Leave Type">
                  <MenuItem value="annual">Annual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="personal">Personal Leave</MenuItem>
                  <MenuItem value="maternity">Maternity Leave</MenuItem>
                  <MenuItem value="paternity">Paternity Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Days"
                type="number"
                margin="normal"
              />
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
                multiline
                rows={4}
                label="Reason for Leave"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Leave Balance: Annual: 15 days | Sick: 10 days | Personal: 5 days
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leave;
