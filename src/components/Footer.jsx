import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { isLoggedIn, isRecruiter, isAdmin } = useAuth();
  
  return (
    <footer className="bg-body-tertiary border-top py-5 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h3 className="h5 fw-bold text-primary mb-3">WebifyJobs</h3>
            <p className="text-secondary">
              Connecting top talent with the best opportunities globally. 
              Your next career move starts here.
            </p>
          </div>
          
          <div className="col-md-4">
            <h4 className="h6 fw-semibold mb-3">Quick Links</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary custom-hover">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary custom-hover">About Us</Link></li>
              {!isLoggedIn && (
                <>
                  <li><Link to="/login" className="text-decoration-none text-secondary custom-hover">Login</Link></li>
                  <li><Link to="/register" className="text-decoration-none text-secondary custom-hover">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="col-md-4">
            <h4 className="h6 fw-semibold mb-3">User Area</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              {!isLoggedIn ? (
                <li className="text-muted small fst-italic">Log in to access your personal area.</li>
              ) : (
                <>
                  <li><Link to="/profile" className="text-decoration-none text-secondary custom-hover">Profile</Link></li>
                  <li><Link to="/saved-jobs" className="text-decoration-none text-secondary custom-hover">Saved Jobs</Link></li>
                </>
              )}
              {isRecruiter && (
                <li><Link to="/my-jobs" className="text-decoration-none text-secondary custom-hover">My Jobs</Link></li>
              )}
              {isAdmin && (
                <li><Link to="/admin" className="text-decoration-none text-secondary custom-hover">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-top mt-5 pt-4 text-center text-muted small">
          &copy; {new Date().getFullYear()} WebifyJobs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
