import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user);
            navigate('/');
        },
        onError: (error) => {
            setError(error.message || 'Login failed. Please check your credentials.');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        loginMutation({
            variables: { username, password },
        });
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Employee Management System
                    </Typography>
                    <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Demo Credentials:</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Admin: username=<strong>admin</strong>, password=<strong>admin123</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Employee: username=<strong>employee</strong>, password=<strong>employee123</strong>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
