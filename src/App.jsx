import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import client from './config/apolloClient';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeGrid from './components/EmployeeGrid';
import EmployeeTiles from './components/EmployeeTiles';
import EmployeeForm from './components/EmployeeForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/grid" element={<EmployeeGrid />} />
                      <Route path="/tiles" element={<EmployeeTiles />} />
                      <Route path="/add" element={<EmployeeForm />} />
                      <Route path="/edit/:id" element={<EmployeeForm />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
