import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks, useDeleteTask } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './TaskList.css';

const TaskList = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: tasks, isLoading, error } = useTasks();
  const deleteTaskMutation = useDeleteTask();

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load tasks" />;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">
          Create New Task
        </Link>
      </div>

      <div className="task-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="task-stats">
        <div className="stat">
          <span className="stat-number">{filteredTasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredTasks.filter(task => task.status === 'PENDING').length}
          </span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredTasks.filter(task => task.status === 'IN_PROGRESS').length}
          </span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredTasks.filter(task => task.status === 'COMPLETED').length}
          </span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {tasks?.length === 0 
              ? "You don't have any tasks yet. Create your first task!"
              : "No tasks match your current filters."
            }
          </p>
          {tasks?.length === 0 && (
            <Link to="/tasks/new" className="btn btn-primary">
              Create Your First Task
            </Link>
          )}
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
