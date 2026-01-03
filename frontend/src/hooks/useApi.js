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

  // Create a shallow copy of options but remove onError/onSuccess handlers
  // so we can wrap them without infinite recursion/overwriting.
  const opts = { ...options };
  delete opts.onError;
  delete opts.onSuccess;

  return useMutation(mutationFn, {
    ...opts,
    onError: (error, variables, context) => {
      const message = handleApiError(error);
      toast.error(message);
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      // generic success handling
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey);
        });
      }

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

// Specific hooks for common operations
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useApiMutation(
    ({ email, password }) =>
      import('../services').then(({ authAPI }) => authAPI.login({ email, password })),
    {
      onSuccess: (response) => {
        // axios responses are in response.data
        const payload = response?.data || response;
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
        }
        if (payload?.user) {
          queryClient.setQueryData(['auth', 'user'], payload.user);
        }
      },
    }
  );

  const registerMutation = useApiMutation(
    (userData) =>
      import('../services').then(({ authAPI }) => authAPI.register(userData)),
    {
      onSuccess: (response) => {
        const payload = response?.data || response;
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
        }
        if (payload?.user) {
          queryClient.setQueryData(['auth', 'user'], payload.user);
        }
      },
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