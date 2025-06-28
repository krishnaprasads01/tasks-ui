import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h1>Task Manager</h1>
          </Link>
        </div>
        
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/tasks" 
                className={`nav-link ${isActive('/tasks') || isActive('/') ? 'active' : ''}`}
              >
                All Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/tasks/new" 
                className={`nav-link ${isActive('/tasks/new') ? 'active' : ''}`}
              >
                Create Task
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
