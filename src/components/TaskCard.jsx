import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import './TaskCard.css';

const TaskCard = ({ task, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-status-priority">
          <span className={`status-badge ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        <div className="task-actions">
          <Link 
            to={`/tasks/${task.id}/edit`}
            className="btn btn-sm btn-secondary"
            title="Edit task"
          >
            ✏️
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-sm btn-danger"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <Link to={`/tasks/${task.id}`} className="task-card-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">
          {task.description && task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description || 'No description'
          }
        </p>
        
        <div className="task-metadata">
          {task.dueDate && (
            <div className="task-due-date">
              <span className="label">Due:</span>
              <span className={`value ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          
          <div className="task-created">
            <span className="label">Created:</span>
            <span className="value">{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TaskCard;
