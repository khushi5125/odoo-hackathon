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
import { Payments, Add, Download, Visibility } from '@mui/icons-material';

const Payroll = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mockPayrollRecords = [
    {
      id: 1,
      employee: 'John Doe',
      employeeId: 'EMP001',
      payPeriod: 'December 2024',
      basicSalary: 5000,
      allowances: 500,
      deductions: 300,
      grossSalary: 5500,
      netSalary: 5200,
      status: 'paid',
      paymentDate: '2024-12-01',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      employeeId: 'EMP002',
      payPeriod: 'December 2024',
      basicSalary: 6000,
      allowances: 600,
      deductions: 400,
      grossSalary: 6600,
      netSalary: 6200,
      status: 'approved',
      paymentDate: null,
      paymentMethod: 'bank_transfer'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      employeeId: 'EMP003',
      payPeriod: 'December 2024',
      basicSalary: 4500,
      allowances: 400,
      deductions: 250,
      grossSalary: 4900,
      netSalary: 4650,
      status: 'draft',
      paymentDate: null,
      paymentMethod: 'bank_transfer'
    }
  ];

  useEffect(() => {
    setPayrollRecords(mockPayrollRecords);
    setTotalPages(1);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'primary';
      case 'draft': return 'warning';
      case 'calculated': return 'info';
      default: return 'default';
    }
  };

  const filteredRecords = tabValue === 0 
    ? payrollRecords 
    : payrollRecords.filter(rec => rec.status === ['draft', 'approved', 'paid'][tabValue - 1]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payroll Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Generate Payroll
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Draft
              </Typography>
              <Typography variant="h4">
                {payrollRecords.filter(r => r.status === 'draft').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Approved
              </Typography>
              <Typography variant="h4">
                {payrollRecords.filter(r => r.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Paid
              </Typography>
              <Typography variant="h4">
                {payrollRecords.filter(r => r.status === 'paid').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Total Payroll
              </Typography>
              <Typography variant="h4">
                ${payrollRecords.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payroll Records
          </Typography>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="All" />
            <Tab label="Draft" />
            <Tab label="Approved" />
            <Tab label="Paid" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Pay Period</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
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
                    <TableCell>{record.payPeriod}</TableCell>
                    <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                    <TableCell>${record.grossSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium" color="success.main">
                        ${record.netSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {record.paymentDate || '-'}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        {record.status !== 'draft' && (
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                        )}
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
        <DialogTitle>Generate Payroll</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Employee</InputLabel>
                <Select label="Employee">
                  <MenuItem value="all">All Employees</MenuItem>
                  <MenuItem value="john">John Doe</MenuItem>
                  <MenuItem value="jane">Jane Smith</MenuItem>
                  <MenuItem value="mike">Mike Johnson</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Pay Period</InputLabel>
                <Select label="Pay Period">
                  <MenuItem value="december">December 2024</MenuItem>
                  <MenuItem value="january">January 2025</MenuItem>
                  <MenuItem value="february">February 2025</MenuItem>
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
              <Typography variant="h6" gutterBottom>
                Attendance Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Working Days"
                    type="number"
                    defaultValue="22"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Present Days"
                    type="number"
                    defaultValue="20"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Leave Days"
                    type="number"
                    defaultValue="2"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Absent Days"
                    type="number"
                    defaultValue="0"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Allowances & Deductions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="HRA Allowance"
                    type="number"
                    defaultValue="500"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Transport Allowance"
                    type="number"
                    defaultValue="200"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="PF Deduction"
                    type="number"
                    defaultValue="300"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tax Deduction"
                    type="number"
                    defaultValue="400"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Generate Payroll</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll;
