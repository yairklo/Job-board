import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyJobs, deleteJob } from '../services/jobsService';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';
import { FiBriefcase, FiPlus } from 'react-icons/fi';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setIsLoading(true);
        const data = await getMyJobs();
        setJobs(Array.isArray(data) ? data : data.docs || []);
      } catch (error) {
        toast.error('Failed to load your jobs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleEdit = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const confirmDelete = (jobId) => {
    setJobToDelete(jobId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete);
      setJobs(prev => prev.filter(job => job._id !== jobToDelete));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-5 gap-3">
        <div>
          <h1 className="display-6 fw-bold text-body d-flex align-items-center">
            <FiBriefcase className="me-3 text-primary" />
            My Posted Jobs
          </h1>
          <p className="text-secondary mt-2 mb-0">
            Manage the opportunities you've posted on WebifyJobs.
          </p>
        </div>
        <button
          onClick={() => navigate('/jobs/create')}
          className="btn btn-primary d-flex align-items-center px-4 py-2 fw-medium"
        >
          <FiPlus className="me-2 fs-5" />
          Post New Job
        </button>
      </div>

      {isLoading ? (
        <div className="row g-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <JobCardSkeleton />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState 
          title="No jobs posted" 
          message="You haven't posted any jobs yet. Create your first job listing to start receiving applications."
          icon={FiBriefcase}
          action={{ label: 'Post a Job', onClick: () => navigate('/jobs/create') }}
        />
      ) : (
        <div className="row g-4">
          {jobs.map(job => (
            <div className="col-12 col-md-6 col-lg-4" key={job._id}>
              <JobCard 
                job={job} 
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setIsDeleteModalOpen(false); setJobToDelete(null); }}
        confirmText="Delete"
      />
    </div>
  );
};

export default MyJobs;
