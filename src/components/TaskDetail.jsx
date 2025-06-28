import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask, useDeleteTask } from '../hooks/useTasks';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import './TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(id);
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(id);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load task details" />;
  if (!task) return <ErrorMessage message="Task not found" />;

  const isOverdue = false; // Remove since we don't have dueDate

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <div className="header-actions">
          <Link to="/tasks" className="btn btn-secondary">
            ← Back to Tasks
          </Link>
          <div className="action-buttons">
            <Link 
              to={`/tasks/${id}/edit`}
              className="btn btn-primary"
            >
              Edit Task
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleteTaskMutation.isPending}
            >
              {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </div>

      <div className="task-detail-content">
        <div className="task-header">
          <h1 className="task-title">{task.title}</h1>
          <div className="task-badges">
            <span className={`status-badge ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="task-details-grid">
          <div className="detail-section">
            <h3>Description</h3>
            <div className="description-content">
              {task.description ? (
                <p>{task.description}</p>
              ) : (
                <p className="no-description">No description provided</p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Task Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Status:</span>
                <span className={`value status-${task.status.toLowerCase()}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Created:</span>
                <span className="value">{formatDate(task.createdAt)}</span>
              </div>

              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div className="info-item">
                  <span className="label">Last Updated:</span>
                  <span className="value">{formatDate(task.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
