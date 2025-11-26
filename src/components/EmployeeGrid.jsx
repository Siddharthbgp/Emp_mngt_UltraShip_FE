import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    IconButton,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { LIST_EMPLOYEES_QUERY } from '../graphql/queries';
import { DELETE_EMPLOYEE_MUTATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeeGrid = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('ASC');
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const { loading, error, data, refetch } = useQuery(LIST_EMPLOYEES_QUERY, {
        variables: {
            pagination: { page, limit: rowsPerPage },
            sort: { field: orderBy, direction: order },
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field) => {
        const isAsc = orderBy === field && order === 'ASC';
        setOrder(isAsc ? 'DESC' : 'ASC');
        setOrderBy(field);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee({ variables: { id } });
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
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
    const totalElements = data?.listEmployees?.totalElements || 0;

    const columns = [
        { id: 'id', label: 'ID', sortable: true },
        { id: 'name', label: 'Name', sortable: true },
        { id: 'age', label: 'Age', sortable: true },
        { id: 'department', label: 'Department', sortable: true },
        { id: 'email', label: 'Email', sortable: false },
        { id: 'phone', label: 'Phone', sortable: false },
        { id: 'attendance', label: 'Attendance %', sortable: true },
        { id: 'position', label: 'Position', sortable: false },
        { id: 'salary', label: 'Salary', sortable: true },
        { id: 'status', label: 'Status', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Employee Grid View</Typography>
                {isAdmin() && (
                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Add Employee
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order.toLowerCase() : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id} hover>
                                <TableCell>{employee.id}</TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.age}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phone || 'N/A'}</TableCell>
                                <TableCell>{employee.attendance}%</TableCell>
                                <TableCell>{employee.position || 'N/A'}</TableCell>
                                <TableCell>${employee.salary?.toLocaleString() || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={employee.status || 'ACTIVE'}
                                        color={employee.status === 'ACTIVE' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {isAdmin() && (
                                        <>
                                            <IconButton size="small" onClick={() => handleEdit(employee.id)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(employee.id)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>
        </Container>
    );
};

export default EmployeeGrid;
