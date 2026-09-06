import React, { useState, useEffect, useMemo } from 'react';
import { getRecentJobs } from '../services/jobsService';
import { filterWhatsAppJobs } from '../utils/whatsappJob';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import EmptyState from '../components/EmptyState';
import DateAddedFilter from '../components/DateAddedFilter';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

const WhatsAppFeed = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [group, setGroup] = useState('');
  const [status, setStatus] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentJobs({ limit: 200 });
        setAllJobs(data.jobs || []);
      } catch (error) {
        toast.error('Failed to load WhatsApp jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const groupOptions = useMemo(
    () => [...new Set(allJobs.map((job) => job.group).filter((value) => value && value !== '—'))].sort(),
    [allJobs]
  );

  const statusOptions = useMemo(() => {
    const values = new Set();
    allJobs.forEach((job) => {
      if (job.status) values.add(job.status);
      if (job.approvalStatus) values.add(job.approvalStatus);
    });
    return [...values].sort();
  }, [allJobs]);

  const filteredJobs = useMemo(
    () => filterWhatsAppJobs(allJobs, { search: debouncedSearch, group, status, dateAdded }),
    [allJobs, debouncedSearch, group, status, dateAdded]
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / limit));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const displayedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredJobs.slice(startIndex, startIndex + limit);
  }, [filteredJobs, currentPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setGroup('');
    setStatus('');
    setDateAdded('');
  };

  return (
    <div className="d-flex flex-column gap-5">
      <div className="bg-primary rounded-4 p-4 p-md-5 text-center text-white shadow">
        <h1 className="display-5 fw-bolder mb-3">WhatsApp job feed</h1>
        <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '600px' }}>
          Browse roles collected from WhatsApp groups. Search, filter, and open the original apply link.
        </p>

        <div className="mx-auto d-flex flex-column flex-lg-row flex-wrap gap-3" style={{ maxWidth: '960px' }}>
          <div className="position-relative flex-grow-1 min-w-0">
            <FiSearch className="position-absolute top-50 start-0 translate-middle-y text-secondary ms-3 fs-5" />
            <input
              type="text"
              placeholder="Search title, company, or group..."
              className="form-control form-control-lg ps-5 border-0 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select form-select-lg border-0 shadow-sm"
            value={group}
            onChange={(e) => { setGroup(e.target.value); handleFilterChange(); }}
            aria-label="Filter by WhatsApp group"
          >
            <option value="">All groups</option>
            {groupOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            className="form-select form-select-lg border-0 shadow-sm"
            value={status}
            onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <DateAddedFilter
            value={dateAdded}
            onChange={(value) => { setDateAdded(value); handleFilterChange(); }}
          />
        </div>
      </div>

      <div>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
          <h2 className="h3 fw-bold mb-0">Latest from WhatsApp</h2>
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
            action={{ label: 'Clear Filters', onClick: clearFilters }}
          />
        ) : (
          <>
            <div className="row g-4">
              {displayedJobs.map((job) => (
                <div className="col-12 col-md-6 col-lg-4" key={job._id || job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-5 d-flex justify-content-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline-secondary"
                >
                  Previous
                </button>
                <span className="btn btn-light disabled text-dark border">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default WhatsAppFeed;
