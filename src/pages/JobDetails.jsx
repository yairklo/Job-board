import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, toggleSaveJob, deleteJob } from '../services/jobsService';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import JobDetailsHeader from '../components/JobDetailsHeader';
import JobDetailsSidebar from '../components/JobDetailsSidebar';
import { FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isRecruiter, isAdmin } = useAuth();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-slate-500">Job not found</div>;
  }

  const isSaved = job.savedBy?.includes(user?._id);
  const canEdit = isAdmin || (isRecruiter && job.recruiter_id === user?._id);
  const canDelete = isAdmin || (isRecruiter && job.recruiter_id === user?._id);

  const handleSave = async () => {
    try {
      await toggleSaveJob(id);
      setJob({
        ...job,
        savedBy: isSaved 
          ? job.savedBy.filter(uId => uId !== user?._id)
          : [...(job.savedBy || []), user?._id]
      });
      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully');
    } catch (error) {
      toast.error('Failed to update saved status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(id);
      toast.success('Job deleted successfully');
      navigate(isRecruiter ? '/my-jobs' : '/');
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container py-5 mt-3" style={{ maxWidth: '1000px' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-decoration-none text-secondary d-inline-flex align-items-center mb-4 p-0 custom-hover"
      >
        <FiChevronLeft className="me-1" /> Back to jobs
      </button>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        
        <JobDetailsHeader 
          job={job}
          isSaved={isSaved}
          isLoggedIn={isLoggedIn}
          isRecruiter={isRecruiter}
          isAdmin={isAdmin}
          canEdit={canEdit}
          canDelete={canDelete}
          handleSave={handleSave}
          navigate={navigate}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />

        {/* Content Section */}
        <div className="card-body p-4 p-md-5">
          <div className="row g-5">
            <div className="col-lg-8">
              <section>
                <h2 className="h4 fw-bold text-body mb-4">Job Description</h2>
                <div className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                  <p className="whitespace-pre-line m-0">{job.description}</p>
                </div>
              </section>
            </div>

            <div className="col-lg-4">
              <JobDetailsSidebar job={job} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
      />
    </div>
  );
};

export default JobDetails;
