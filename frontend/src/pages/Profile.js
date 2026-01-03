import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Avatar,
  Chip,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { Edit, Upload, AccountCircle, Work, Payment, Description } from '@mui/icons-material';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, City, State 12345',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 234 567 8901'
      }
    },
    job: {
      employeeId: 'EMP001',
      department: 'Engineering',
      position: 'Senior Developer',
      hireDate: '2022-01-15',
      workSchedule: {
        monday: { start: '09:00', end: '18:00', working: true },
        tuesday: { start: '09:00', end: '18:00', working: true },
        wednesday: { start: '09:00', end: '18:00', working: true },
        thursday: { start: '09:00', end: '18:00', working: true },
        friday: { start: '09:00', end: '18:00', working: true },
        saturday: { start: '-', end: '-', working: false },
        sunday: { start: '-', end: '-', working: false }
      },
      reportingTo: 'Tech Lead',
      location: 'Office'
    },
    salary: {
      basicSalary: 5000,
      allowances: [
        { name: 'HRA', amount: 500 },
        { name: 'Transport', amount: 200 }
      ],
      deductions: [
        { name: 'PF', amount: 300 },
        { name: 'Tax', amount: 400 }
      ],
      totalSalary: 5200,
      paymentMethod: 'Bank Transfer',
      bankDetails: {
        accountNumber: '****1234',
        bankName: 'ABC Bank',
        ifscCode: 'ABC123456'
      }
    },
    documents: [
      { name: 'Resume', type: 'PDF', uploadDate: '2022-01-15' },
      { name: 'ID Proof', type: 'PDF', uploadDate: '2022-01-15' },
      { name: 'Address Proof', type: 'PDF', uploadDate: '2022-01-15' }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Profile</Typography>
        <Button 
          variant={editMode ? "contained" : "outlined"} 
          startIcon={editMode ? null : <Edit />}
          onClick={editMode ? handleSave : handleEdit}
        >
          {editMode ? 'Save' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                {profileData.personal.firstName[0]}{profileData.personal.lastName[0]}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {profileData.personal.firstName} {profileData.personal.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {profileData.job.position}
              </Typography>
              <Chip label={profileData.job.employeeId} color="primary" size="small" />
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  {profileData.personal.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profileData.personal.phone}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <IconButton color="primary">
                  <Upload />
                </IconButton>
                <Typography variant="caption" display="block">
                  Change Photo
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab icon={<AccountCircle />} label="Personal" />
                <Tab icon={<Work />} label="Job Details" />
                <Tab icon={<Payment />} label="Salary" />
                <Tab icon={<Description />} label="Documents" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.personal.firstName}
                      onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.personal.lastName}
                      onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.personal.email}
                      onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.personal.phone}
                      onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={profileData.personal.address}
                      onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
                      disabled={!editMode}
                      multiline
                      rows={2}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profileData.personal.dateOfBirth}
                      onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gender"
                      value={profileData.personal.gender}
                      onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={profileData.job.employeeId}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.job.department}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={profileData.job.position}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Hire Date"
                      type="date"
                      value={profileData.job.hireDate}
                      disabled
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reporting To"
                      value={profileData.job.reportingTo}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Work Location"
                      value={profileData.job.location}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Salary Structure
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Basic Salary"
                      value={`$${profileData.salary.basicSalary.toLocaleString()}`}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Total Salary"
                      value={`$${profileData.salary.totalSalary.toLocaleString()}`}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Allowances
                    </Typography>
                    {profileData.salary.allowances.map((allowance, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                        <Typography>{allowance.name}</Typography>
                        <Typography>${allowance.amount}</Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Deductions
                    </Typography>
                    {profileData.salary.deductions.map((deduction, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                        <Typography>{deduction.name}</Typography>
                        <Typography>${deduction.amount}</Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Bank Details
                    </Typography>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={profileData.salary.bankDetails.bankName}
                      disabled={!editMode}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={profileData.salary.bankDetails.accountNumber}
                      disabled={!editMode}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={profileData.salary.bankDetails.ifscCode}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              )}

              {tabValue === 3 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Documents
                    </Typography>
                  </Grid>
                  {profileData.documents.map((doc, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1">{doc.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {doc.type} • Uploaded on {doc.uploadDate}
                          </Typography>
                        </Box>
                        <Box>
                          <Button size="small" variant="outlined">
                            View
                          </Button>
                          <Button size="small" variant="outlined" sx={{ ml: 1 }}>
                            Download
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="contained" startIcon={<Upload />} fullWidth>
                      Upload New Document
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
