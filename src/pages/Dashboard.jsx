import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { TableChart, ViewModule, Add, People } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();

    const cards = [
        {
            title: 'Grid View',
            description: 'View all employees in a detailed table format with sorting and pagination',
            icon: <TableChart sx={{ fontSize: 60 }} />,
            action: () => navigate('/grid'),
            color: '#1976d2',
        },
        {
            title: 'Tile View',
            description: 'Browse employees in a card-based layout with quick actions',
            icon: <ViewModule sx={{ fontSize: 60 }} />,
            action: () => navigate('/tiles'),
            color: '#2e7d32',
        },
    ];

    if (isAdmin()) {
        cards.push({
            title: 'Add Employee',
            description: 'Add a new employee to the system',
            icon: <Add sx={{ fontSize: 60 }} />,
            action: () => navigate('/add'),
            color: '#ed6c02',
        });
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box mb={4}>
                <Typography variant="h3" gutterBottom>
                    Welcome, {user?.fullName || user?.username}!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Employee Management Dashboard
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        color: card.color,
                                        mb: 2,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={card.action}
                                    sx={{ bgcolor: card.color }}
                                >
                                    Open
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={6} p={3} bgcolor="grey.100" borderRadius={2}>
                <Typography variant="h6" gutterBottom>
                    <People sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Quick Stats
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Use the navigation menu above to access different views and manage employees.
                    {isAdmin() && ' As an admin, you have full access to add, edit, and delete employees.'}
                </Typography>
            </Box>
        </Container>
    );
};

export default Dashboard;
