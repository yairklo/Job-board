import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5 pb-3">
        <h1 className="display-4 fw-bolder text-body">
          About WebifyJobs
        </h1>
        <p className="lead text-secondary mt-3 mx-auto" style={{ maxWidth: '600px' }}>
          A Job Board for seekers and recruiters, plus a personal feed of roles collected from WhatsApp groups.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-5 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h2 className="h3 fw-bold text-body mb-4">Two ways to browse</h2>
          <div className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            <p className="mb-4">
              The home page lists jobs from the WebifyJobs API — register, save roles, and post listings if you are a recruiter.
            </p>
            <p className="mb-0">
              The WhatsApp feed loads recent jobs from the collector API. Titles are cleaned and company names are parsed when needed. Apply opens the original posting.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h3 className="h4 fw-bold text-primary mb-3">Job Board</h3>
            <ul className="list-unstyled mb-4 text-primary text-opacity-75 d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Discover roles posted by recruiters
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Save jobs and manage your profile
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Recruiters can create, edit, and delete listings
              </li>
            </ul>
            <div>
              <Link to="/" className="fw-medium text-primary text-decoration-none custom-hover">
                Browse the job board &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-light">
            <h3 className="h4 fw-bold text-body mb-3">WhatsApp Feed</h3>
            <ul className="list-unstyled mb-4 text-secondary d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Search title, company, or group
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Filter by WhatsApp group and status
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Open the original apply link
              </li>
            </ul>
            <div>
              <Link to="/whatsapp" className="fw-medium text-primary text-decoration-none custom-hover">
                Open the WhatsApp feed &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
