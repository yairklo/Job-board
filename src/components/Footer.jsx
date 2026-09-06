import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-body-tertiary border-top py-5 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-6">
            <h3 className="h5 fw-bold text-primary mb-3">Job Feed</h3>
            <p className="text-secondary">
              Personal browser for jobs collected from WhatsApp groups. Local use only — apply on the original posting.
            </p>
          </div>

          <div className="col-md-6">
            <h4 className="h6 fw-semibold mb-3">Quick Links</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary custom-hover">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary custom-hover">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-top mt-5 pt-4 text-center text-muted small">
          &copy; {new Date().getFullYear()} Job Feed. Local browsing only.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
