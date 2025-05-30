import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { User, CITY_DISPLAY_NAMES, UserTableProps } from '../types';

/**
 * UserTable component for displaying users in a table format
 * Features Material-UI design, actions, and proper data formatting
 */
const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Format datetime for display
   */
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No users found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first user to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Birth Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Updated</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: 'grey.50' }
              }}
            >
              {/* Name */}
              <TableCell>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {user.id}
                  </Typography>
                </Box>
              </TableCell>

              {/* Birth Date */}
              <TableCell>
                <Typography variant="body2">
                  {formatDate(user.birthDate)}
                </Typography>
              </TableCell>

              {/* City */}
              <TableCell>
                <Chip 
                  label={CITY_DISPLAY_NAMES[user.city]} 
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </TableCell>

              {/* Created Date */}
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(user.createdAt)}
                </Typography>
              </TableCell>

              {/* Updated Date */}
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(user.updatedAt)}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="Edit user">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(user)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete user">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(user.id)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'error.light',
                          color: 'white'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable; 