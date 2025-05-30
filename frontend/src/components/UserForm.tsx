import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { 
  User, 
  CreateUserInput, 
  UpdateUserInput, 
  CityEnum, 
  CITY_DISPLAY_NAMES,
  FormErrors,
  UserFormProps 
} from '../types';

/**
 * UserForm component for creating and editing users
 * Features form validation, Material-UI design, and proper error handling
 */
const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: null as Dayjs | null,
    city: '' as CityEnum | ''
  });

  // Error state
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: dayjs(user.birthDate),
        city: user.city
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: null,
        city: ''
      });
    }
    setErrors({});
    setSubmitError('');
  }, [user]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else if (formData.birthDate.isAfter(dayjs())) {
      newErrors.birthDate = 'Birth date cannot be in the future';
    } else if (formData.birthDate.isBefore(dayjs().subtract(120, 'years'))) {
      newErrors.birthDate = 'Birth date cannot be more than 120 years ago';
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateUserInput | UpdateUserInput = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        birthDate: formData.birthDate!.format('YYYY-MM-DD'),
        city: formData.city as CityEnum
      };

      await onSubmit(submitData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target ? event.target.value : event;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onCancel} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {user ? 'Edit User' : 'Create New User'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* First Name */}
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={loading}
              required
              fullWidth
              variant="outlined"
            />

            {/* Last Name */}
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={loading}
              required
              fullWidth
              variant="outlined"
            />

            {/* Birth Date */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birth Date"
                value={formData.birthDate}
                onChange={handleInputChange('birthDate')}
                disabled={loading}
                maxDate={dayjs()}
                minDate={dayjs().subtract(120, 'years')}
                slotProps={{
                  textField: {
                    error: !!errors.birthDate,
                    helperText: errors.birthDate,
                    required: true,
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </LocalizationProvider>

            {/* City */}
            <FormControl 
              fullWidth 
              variant="outlined" 
              error={!!errors.city}
              disabled={loading}
              required
            >
              <InputLabel>City</InputLabel>
              <Select
                value={formData.city}
                onChange={handleInputChange('city')}
                label="City"
              >
                {Object.values(CityEnum).map((city) => (
                  <MenuItem key={city} value={city}>
                    {CITY_DISPLAY_NAMES[city]}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                  {errors.city}
                </Box>
              )}
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={onCancel} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm; 