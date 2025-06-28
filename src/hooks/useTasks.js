import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';

// Query keys
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), { filters }],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
  byStatus: (status) => [...taskKeys.all, 'status', status],
  byUser: (userId) => [...taskKeys.all, 'user', userId],
};

// Hooks for tasks
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getAllTasks().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getTaskById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useTasksByStatus = (status) => {
  return useQuery({
    queryKey: taskKeys.byStatus(status),
    queryFn: () => taskApi.getTasksByStatus(status).then(res => res.data),
    enabled: !!status,
  });
};

export const useSearchTasks = (keyword) => {
  return useQuery({
    queryKey: [...taskKeys.all, 'search', keyword],
    queryFn: () => taskApi.searchTasks(keyword).then(res => res.data),
    enabled: !!keyword && keyword.length > 2,
  });
};

// Mutations
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData) => taskApi.createTask(taskData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...taskData }) => taskApi.updateTask(id, taskData).then(res => res.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
