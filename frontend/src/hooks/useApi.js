import { useQuery, useMutation, useQueryClient } from 'react-query';
import { handleApiError } from '../services';
import toast from 'react-hot-toast';

// Custom hook for API queries with error handling
export const useApiQuery = (queryKey, queryFn, options = {}) => {
  return useQuery(queryKey, queryFn, {
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    ...options,
  });
};

// Custom hook for API mutations with success/error handling
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation(mutationFn, {
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
    onSuccess: (data, variables, context) => {
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey);
        });
      }
    },
    ...options,
  });
};

// Specific hooks for common operations
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useApiMutation(
    ({ email, password }) => 
      import('../services').then(({ authAPI }) => authAPI.login({ email, password })),
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['auth', 'user'], data.user);
      },
    }
  );

  const registerMutation = useApiMutation(
    (userData) => 
      import('../services').then(({ authAPI }) => authAPI.register(userData)),
    {
      successMessage: 'Registration successful!',
    }
  );

  const logoutMutation = useApiMutation(
    () => Promise.resolve(),
    {
      onSuccess: () => {
        localStorage.removeItem('token');
        queryClient.clear();
        window.location.href = '/login';
      },
    }
  );

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isLoading || registerMutation.isLoading,
  };
};
