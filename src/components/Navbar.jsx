import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { isLoggedIn, isRecruiter, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', show: true },
    { name: 'WhatsApp Feed', path: '/whatsapp', show: true },
    { name: 'About', path: '/about', show: true },
    { name: 'Saved Jobs', path: '/saved-jobs', show: isLoggedIn },
    { name: 'My Jobs', path: '/my-jobs', show: isRecruiter },
    { name: 'Profile', path: '/profile', show: isLoggedIn },
    { name: 'Admin Dashboard', path: '/admin', show: isAdmin },
  ];

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary border-bottom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          WebifyJobs
        </Link>

        <div className="d-flex d-md-none align-items-center">
          <button onClick={toggleTheme} className="btn btn-link text-secondary p-1 me-2" aria-label="Toggle theme">
            {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="navbar-toggler border-0 p-1" type="button" aria-label="Toggle navigation">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            {navLinks.filter((link) => link.show).map((link) => (
              <li className="nav-item" key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="nav-link fw-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button onClick={toggleTheme} className="btn btn-link text-secondary p-0 d-none d-md-block" aria-label="Toggle theme">
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="btn btn-outline-secondary fw-medium w-100 w-md-auto"
              >
                Logout
              </button>
            ) : (
              <div className="d-flex gap-2 w-100 w-md-auto mt-2 mt-md-0">
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-light fw-medium w-100 w-md-auto">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary fw-medium w-100 w-md-auto">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
