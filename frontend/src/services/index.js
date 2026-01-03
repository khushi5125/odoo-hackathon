// Re-export all API services for easy importing
export {
  authAPI,
  employeesAPI,
  attendanceAPI,
  leaveAPI,
  payrollAPI,
  performanceAPI,
  trainingAPI,
  default as api
} from './api';

// Utility functions for common API operations
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  console.error('API Error:', error);
  return message;
};

export const createQueryConfig = (queryKey, queryFn, options = {}) => ({
  queryKey,
  queryFn,
  ...options,
});

export const createMutationConfig = (mutationFn, options = {}) => ({
  mutationFn,
  ...options,
});
