import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary border-bottom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          Job Feed
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
            {navLinks.map((link) => (
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
            <span className="small text-secondary d-none d-md-inline">Local WhatsApp feed</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
