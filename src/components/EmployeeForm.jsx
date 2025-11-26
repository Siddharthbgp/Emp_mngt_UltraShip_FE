import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Alert,
    CircularProgress,
    MenuItem,
    Chip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
} from '@mui/material';
import { GET_EMPLOYEE_QUERY } from '../graphql/queries';
import { ADD_EMPLOYEE_MUTATION, UPDATE_EMPLOYEE_MUTATION } from '../graphql/mutations';

const EmployeeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        department: '',
        subjects: [],
        attendance: '',
        email: '',
        phone: '',
        address: '',
        joiningDate: '',
        salary: '',
        position: '',
        status: 'ACTIVE',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const { data: employeeData, loading: loadingEmployee } = useQuery(GET_EMPLOYEE_QUERY, {
        variables: { id },
        skip: !isEditMode,
        onCompleted: (data) => {
            if (data?.getEmployee) {
                const emp = data.getEmployee;
                setFormData({
                    name: emp.name || '',
                    age: emp.age?.toString() || '',
                    department: emp.department || '',
                    subjects: emp.subjects || [],
                    attendance: emp.attendance?.toString() || '',
                    email: emp.email || '',
                    phone: emp.phone || '',
                    address: emp.address || '',
                    joiningDate: emp.joiningDate || '',
                    salary: emp.salary?.toString() || '',
                    position: emp.position || '',
                    status: emp.status || 'ACTIVE',
                });
            }
        },
    });

    const [addEmployee, { loading: adding }] = useMutation(ADD_EMPLOYEE_MUTATION, {
        onCompleted: () => {
            navigate('/grid');
        },
        onError: (error) => {
            setSubmitError(error.message);
        },
    });

    const [updateEmployee, { loading: updating }] = useMutation(UPDATE_EMPLOYEE_MUTATION, {
        onCompleted: () => {
            navigate('/grid');
        },
        onError: (error) => {
            setSubmitError(error.message);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubjectsChange = (event) => {
        const { value } = event.target;
        setFormData((prev) => ({
            ...prev,
            subjects: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.age || formData.age < 18 || formData.age > 100) {
            newErrors.age = 'Age must be between 18 and 100';
        }
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
        if (!formData.attendance || formData.attendance < 0 || formData.attendance > 100) {
            newErrors.attendance = 'Attendance must be between 0 and 100';
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) {
            return;
        }

        const input = {
            name: formData.name,
            age: parseInt(formData.age),
            department: formData.department,
            subjects: formData.subjects,
            attendance: parseFloat(formData.attendance),
            email: formData.email,
            phone: formData.phone || null,
            address: formData.address || null,
            joiningDate: formData.joiningDate || null,
            salary: formData.salary ? parseFloat(formData.salary) : null,
            position: formData.position || null,
            status: formData.status,
        };

        if (isEditMode) {
            updateEmployee({ variables: { id, input } });
        } else {
            addEmployee({ variables: { input } });
        }
    };

    if (loadingEmployee) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    const subjectOptions = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science',
        'English',
        'History',
        'Geography',
        'Economics',
        'Business',
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                </Typography>

                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                error={!!errors.age}
                                helperText={errors.age}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                error={!!errors.department}
                                helperText={errors.department}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.subjects}>
                                <InputLabel>Subjects</InputLabel>
                                <Select
                                    multiple
                                    name="subjects"
                                    value={formData.subjects}
                                    onChange={handleSubjectsChange}
                                    input={<OutlinedInput label="Subjects" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {subjectOptions.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.subjects && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                        {errors.subjects}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Attendance (%)"
                                name="attendance"
                                type="number"
                                value={formData.attendance}
                                onChange={handleChange}
                                error={!!errors.attendance}
                                helperText={errors.attendance}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Joining Date"
                                name="joiningDate"
                                type="date"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="INACTIVE">Inactive</MenuItem>
                                <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={adding || updating}
                                >
                                    {adding || updating ? (
                                        <CircularProgress size={24} />
                                    ) : isEditMode ? (
                                        'Update Employee'
                                    ) : (
                                        'Add Employee'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default EmployeeForm;
