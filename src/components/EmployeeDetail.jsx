import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Chip,
    Box,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeDetail = ({ employee, open, onClose }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    if (!employee) return null;

    const handleEdit = () => {
        onClose();
        navigate(`/edit/${employee.id}`);
    };

    const DetailRow = ({ label, value }) => (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    {label}:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{value || 'N/A'}</Typography>
            </Grid>
        </Grid>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">{employee.name}</Typography>
                    <Chip
                        label={employee.status || 'ACTIVE'}
                        color={employee.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <DetailRow label="Employee ID" value={employee.id} />
                        <DetailRow label="Name" value={employee.name} />
                        <DetailRow label="Age" value={employee.age} />
                        <DetailRow label="Email" value={employee.email} />
                        <DetailRow label="Phone" value={employee.phone} />
                        <DetailRow label="Address" value={employee.address} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Employment Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <DetailRow label="Department" value={employee.department} />
                        <DetailRow label="Position" value={employee.position} />
                        <DetailRow label="Joining Date" value={employee.joiningDate} />
                        <DetailRow label="Salary" value={employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'} />
                        <DetailRow label="Status" value={employee.status} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Performance
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <DetailRow label="Attendance" value={`${employee.attendance}%`} />
                        <DetailRow
                            label="Subjects"
                            value={
                                employee.subjects && employee.subjects.length > 0
                                    ? employee.subjects.join(', ')
                                    : 'N/A'
                            }
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Back
                </Button>
                {isAdmin() && (
                    <Button onClick={handleEdit} variant="contained" color="primary">
                        Edit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeDetail;
