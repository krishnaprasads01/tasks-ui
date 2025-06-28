import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateTask, useUpdateTask, useTask } from '../hooks/useTasks';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './TaskForm.css';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING',
  });

  const [errors, setErrors] = useState({});

  const { data: task, isLoading: isLoadingTask } = useTask(id);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'PENDING',
      });
    }
  }, [isEditing, task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const taskData = {
        ...formData,
      };

      if (isEditing) {
        await updateTaskMutation.mutateAsync({ id, ...taskData });
      } else {
        await createTaskMutation.mutateAsync(taskData);
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    }
  };

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  if (isEditing && isLoadingTask) {
    return <LoadingSpinner />;
  }

  if (isEditing && !task) {
    return <ErrorMessage message="Task not found" />;
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter task title"
            maxLength={200}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Enter task description"
            rows={4}
            maxLength={1000}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
          <small className="char-count">
            {formData.description.length}/1000 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
