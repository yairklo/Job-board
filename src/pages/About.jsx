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
          We connect talented professionals with the world's most innovative companies.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-5 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h2 className="h3 fw-bold text-body mb-4">Our Mission</h2>
          <div className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            <p className="mb-4">
              At WebifyJobs, we believe that finding the right job should be transparent, efficient, and empowering. 
              Our platform was built with a simple goal: to remove the friction from the hiring process for both 
              job seekers and recruiters.
            </p>
            <p className="mb-0">
              Whether you're a recent graduate looking for your first role, a seasoned professional seeking a new challenge, 
              or a company looking to scale your team, we provide the tools and connections you need to succeed.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h3 className="h4 fw-bold text-primary mb-3">For Job Seekers</h3>
            <ul className="list-unstyled mb-4 text-primary text-opacity-75 d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Discover roles tailored to your skills
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Save jobs for later review
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Track your applications (coming soon)
              </li>
            </ul>
            <div>
              <Link to="/register" className="fw-medium text-primary text-decoration-none custom-hover">
                Create an account &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="h-100 p-4 p-md-5 rounded-4 border bg-light">
            <h3 className="h4 fw-bold text-body mb-3">For Recruiters</h3>
            <ul className="list-unstyled mb-4 text-secondary d-flex flex-column gap-2">
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Post opportunities quickly
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Reach a curated pool of talent
              </li>
              <li className="d-flex align-items-start">
                <span className="me-2">•</span> Manage all your listings in one place
              </li>
            </ul>
            <div>
              <Link to="/register" className="fw-medium text-primary text-decoration-none custom-hover">
                Join as a recruiter &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
