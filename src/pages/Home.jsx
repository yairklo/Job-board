import React, { useState, useEffect, useMemo } from 'react';
import { getAllJobs, toggleSaveJob } from '../services/jobsService';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

const Home = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Filters
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch jobs once
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await getAllJobs();
        const fetchedJobs = Array.isArray(data) ? data : data.docs || [];
        setAllJobs(fetchedJobs);
      } catch (error) {
        toast.error('Failed to load jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on criteria (Client-side filtering as per requirement)
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Search matching
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = 
        !debouncedSearch ||
        (job.title && String(job.title).toLowerCase().includes(searchLower)) ||
        (job.company && String(job.company).toLowerCase().includes(searchLower)) ||
        (job.category && String(job.category).toLowerCase().includes(searchLower)) ||
        (job.location && String(job.location).toLowerCase().includes(searchLower));

      // Job Type matching
      const matchesType = !jobType || (job.jobType && String(job.jobType).toLowerCase().trim() === String(jobType).toLowerCase().trim());
      
      // Experience Level matching
      const matchesExperience = !experienceLevel || (job.experienceLevel && String(job.experienceLevel).toLowerCase().trim() === String(experienceLevel).toLowerCase().trim());

      return matchesSearch && matchesType && matchesExperience;
    });
  }, [allJobs, debouncedSearch, jobType, experienceLevel]);

  // Calculate pagination slices
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / limit));
  
  // Safety check: if current page exceeds total pages (e.g. after deleting or filtering), adjust it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const displayedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredJobs.slice(startIndex, startIndex + limit);
  }, [filteredJobs, currentPage]);

  const handleSaveJob = async (jobId) => {
    try {
      await toggleSaveJob(jobId);
      // Optimistic update on allJobs
      setAllJobs(prevJobs => prevJobs.map(job => 
        job._id === jobId 
          ? { ...job, savedBy: job.savedBy?.includes('currentUser') 
              ? job.savedBy.filter(id => id !== 'currentUser') 
              : [...(job.savedBy || []), 'currentUser'] } 
          : job
      ));
      toast.success('Job saved status updated');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset page on filter change
  };

  return (
    <div className="d-flex flex-column gap-5">
      <div className="bg-primary rounded-4 p-5 text-center text-white shadow">
        <h1 className="display-5 fw-bolder mb-3">Find Your Dream Job</h1>
        <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '600px' }}>
          Browse thousands of job openings from top companies and startups.
        </p>
        
        <div className="mx-auto d-flex flex-column flex-md-row gap-3" style={{ maxWidth: '800px' }}>
          <div className="position-relative flex-grow-1">
            <FiSearch className="position-absolute top-50 start-0 translate-middle-y text-secondary ms-3 fs-5" />
            <input
              type="text"
              placeholder="Search by title, company, category, or location..."
              className="form-control form-control-lg ps-5 border-0 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="form-select form-select-lg border-0 shadow-sm"
            style={{ width: 'auto', minWidth: '180px' }}
            value={jobType}
            onChange={(e) => { setJobType(e.target.value); handleFilterChange(); }}
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Freelance">Freelance</option>
            <option value="Temporary">Temporary</option>
            <option value="Internship">Internship</option>
          </select>
          <select 
            className="form-select form-select-lg border-0 shadow-sm"
            style={{ width: 'auto', minWidth: '180px' }}
            value={experienceLevel}
            onChange={(e) => { setExperienceLevel(e.target.value); handleFilterChange(); }}
          >
            <option value="">All Experience</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 fw-bold mb-0">Latest Opportunities</h2>
          <span className="text-secondary fw-medium">
            {filteredJobs.length} jobs found
          </span>
        </div>

        {isLoading ? (
          <div className="row g-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <JobCardSkeleton />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState 
            title="No jobs found" 
            message="We couldn't find any jobs matching your search criteria. Try adjusting your filters."
            action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setJobType(''); setExperienceLevel(''); } }}
          />
        ) : (
          <>
            <div className="row g-4">
              {displayedJobs.map(job => (
                <div className="col-12 col-md-6 col-lg-4" key={job._id}>
                  <JobCard 
                    job={job} 
                    onSave={handleSaveJob}
                  />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-5 d-flex justify-content-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline-secondary"
                >
                  Previous
                </button>
                <span className="btn btn-light disabled text-dark border">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
