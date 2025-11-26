import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Button,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Pagination,
} from '@mui/material';
import { Edit, Delete, Flag, Add } from '@mui/icons-material';
import { LIST_EMPLOYEES_QUERY } from '../graphql/queries';
import { DELETE_EMPLOYEE_MUTATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployeeDetail from './EmployeeDetail';

const EmployeeTiles = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(12);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const { loading, error, data, refetch } = useQuery(LIST_EMPLOYEES_QUERY, {
        variables: {
            pagination: { page: page - 1, limit: rowsPerPage },
            sort: { field: 'id', direction: 'ASC' },
        },
    });

    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE_MUTATION, {
        onCompleted: () => {
            refetch();
        },
        onError: (error) => {
            alert('Error deleting employee: ' + error.message);
        },
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee({ variables: { id } });
        }
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/edit/${id}`);
    };

    const handleFlag = (e) => {
        e.stopPropagation();
        alert('Flag feature - to be implemented');
    };

    const handleTileClick = (employee) => {
        setSelectedEmployee(employee);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedEmployee(null);
    };

    const handleAdd = () => {
        navigate('/add');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error loading employees: {error.message}</Alert>
            </Container>
        );
    }

    const employees = data?.listEmployees?.content || [];
    const totalPages = data?.listEmployees?.totalPages || 0;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Employee Tile View</Typography>
                {isAdmin() && (
                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Add Employee
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {employees.map((employee) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'translateY(-4px)',
                                    transition: 'all 0.3s',
                                },
                            }}
                            onClick={() => handleTileClick(employee)}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {employee.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    ID: {employee.id}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Age: {employee.age} | Dept: {employee.department}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Email: {employee.email}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Attendance: {employee.attendance}%
                                </Typography>
                                <Box mt={1}>
                                    <Chip
                                        label={employee.status || 'ACTIVE'}
                                        color={employee.status === 'ACTIVE' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Box>
                                    <IconButton size="small" onClick={handleFlag} color="warning">
                                        <Flag />
                                    </IconButton>
                                </Box>
                                {isAdmin() && (
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleEdit(employee.id, e)}
                                            color="primary"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleDelete(employee.id, e)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
                </Box>
            )}

            <EmployeeDetail
                employee={selectedEmployee}
                open={detailOpen}
                onClose={handleCloseDetail}
            />
        </Container>
    );
};

export default EmployeeTiles;
