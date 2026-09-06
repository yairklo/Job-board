import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5 pb-3">
        <h1 className="display-4 fw-bolder text-body">
          About this job feed
        </h1>
        <p className="lead text-secondary mt-3 mx-auto" style={{ maxWidth: '600px' }}>
          A personal browser for roles collected from WhatsApp groups. It is meant for local use against the collector API.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-5 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h2 className="h3 fw-bold text-body mb-4">What you can do</h2>
          <div className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            <p className="mb-4">
              The home page loads recent jobs from <code>GET /api/jobs/recent</code>. Titles are cleaned
              (markdown asterisks and hidden RTL marks) and company names are parsed from
              <code> Role / Company </code> when the collector left company blank.
            </p>
            <p className="mb-0">
              Open a job for group, status, and dates, then use Apply to follow the original link
              (usually LinkedIn). This UI does not post applications and does not talk to the old recruiter backend.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h3 className="h4 fw-bold text-primary mb-3">Browse</h3>
            <ul className="list-unstyled mb-4 text-primary text-opacity-75 d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Search title, company, or WhatsApp group
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Filter by group and status
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Hebrew titles render with automatic text direction
              </li>
            </ul>
            <div>
              <Link to="/" className="fw-medium text-primary text-decoration-none custom-hover">
                Open the feed &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-light">
            <h3 className="h4 fw-bold text-body mb-3">Out of scope</h3>
            <ul className="list-unstyled mb-0 text-secondary d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Login, saved jobs, and recruiter admin stay unused
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> No applying from this UI (JobHelper is separate)
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Local phase only — not deployed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
