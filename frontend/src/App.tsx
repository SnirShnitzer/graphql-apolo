import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation
} from '@apollo/client';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import ConfirmDialog from './components/ConfirmDialog';
import { 
  GET_USERS, 
  CREATE_USER, 
  UPDATE_USER, 
  DELETE_USER 
} from './graphql/queries';
import { 
  User, 
  CreateUserInput, 
  UpdateUserInput 
} from './types';

// Apollo Client configuration
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

/**
 * Main UserManagement component
 */
const UserManagement: React.FC = () => {
  // State management
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({
    open: false,
    userId: '',
    userName: ''
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // GraphQL hooks
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    errorPolicy: 'all'
  });

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: 'User created successfully!',
        severity: 'success'
      });
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error creating user: ${error.message}`,
        severity: 'error'
      });
    }
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
      setShowForm(false);
      setEditingUser(null);
      refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error updating user: ${error.message}`,
        severity: 'error'
      });
    }
  });

  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: 'User deleted successfully!',
        severity: 'success'
      });
      setDeleteConfirm({ open: false, userId: '', userName: '' });
      refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error deleting user: ${error.message}`,
        severity: 'error'
      });
    }
  });

  // Event handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = data?.users.find((u: User) => u.id === userId);
    if (user) {
      setDeleteConfirm({
        open: true,
        userId,
        userName: `${user.firstName} ${user.lastName}`
      });
    }
  };

  const handleFormSubmit = async (formData: CreateUserInput | UpdateUserInput) => {
    try {
      if (editingUser) {
        await updateUser({
          variables: {
            id: editingUser.id,
            data: formData
          }
        });
      } else {
        await createUser({
          variables: {
            data: formData as CreateUserInput
          }
        });
      }
    } catch (error) {
      // Error handling is done in mutation hooks
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser({
        variables: {
          id: deleteConfirm.userId
        }
      });
    } catch (error) {
      // Error handling is done in mutation hook
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, userId: '', userName: '' });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Loading state
  if (loading && !data) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Moonshot User Management
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading users: {error.message}
          </Alert>
        )}

        {/* Users Table */}
        <UserTable
          users={data?.users || []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          loading={loading}
        />

        {/* Floating Action Button for Mobile */}
        <Fab
          color="primary"
          aria-label="add user"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={handleCreateUser}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* User Form Dialog */}
      {showForm && (
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={createLoading || updateLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm.userName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * Main App component with providers
 */
const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserManagement />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App; 