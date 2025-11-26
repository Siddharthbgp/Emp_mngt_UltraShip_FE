import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    People,
    Logout,
    ViewModule,
    TableChart,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Grid View', icon: <TableChart />, path: '/grid' },
        { text: 'Tile View', icon: <ViewModule />, path: '/tiles' },
    ];

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee Management
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderBottom: location.pathname === item.path ? 2 : 0,
                                        borderRadius: 0,
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                            {user?.fullName || user?.username} ({user?.role})
                        </Typography>
                        <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                {drawer}
            </Drawer>
        </>
    );
};

export default Navigation;
