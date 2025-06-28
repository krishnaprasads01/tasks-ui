// Date formatting utility
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // If it's today
  if (diffInDays === 0) {
    return `Today at ${date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  }
  
  // If it's yesterday
  if (diffInDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  }
  
  // If it's this year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Full date
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Get priority color class
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'priority-high';
    case 'MEDIUM':
      return 'priority-medium';
    case 'LOW':
      return 'priority-low';
    default:
      return 'priority-medium';
  }
};

// Get status color class
export const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'status-pending';
    case 'IN_PROGRESS':
      return 'status-in-progress';
    case 'COMPLETED':
      return 'status-completed';
    case 'CANCELLED':
      return 'status-cancelled';
    default:
      return 'status-pending';
  }
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate task data
export const validateTaskData = (taskData) => {
  const errors = {};

  if (!taskData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (taskData.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (taskData.description && taskData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(taskData.status)) {
    errors.status = 'Invalid status';
  }

  if (!['LOW', 'MEDIUM', 'HIGH'].includes(taskData.priority)) {
    errors.priority = 'Invalid priority';
  }

  if (taskData.dueDate && new Date(taskData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
    errors.dueDate = 'Due date cannot be in the past';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(dateString);
  }
};
