import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, toggleSaveJob, deleteJob } from '../services/jobsService';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import JobDetailsHeader from '../components/JobDetailsHeader';
import JobDetailsSidebar from '../components/JobDetailsSidebar';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
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
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '16rem' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (!job) {
    return (
      <div className="container py-5 mt-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-muted mb-4 p-4 rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
          <FiSearch size={54} className="text-secondary" />
        </div>
        <h2 className="fw-bold text-dark mb-3">Job Not Found</h2>
        <p className="text-secondary text-center mb-5" style={{ maxWidth: '450px', fontSize: '1.1rem' }}>
          We couldn't find this job in the recent WhatsApp feed. It may have aged out of the list, or the link might be incorrect.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm custom-hover"
        >
          Browse Other Jobs
        </button>
      </div>
    );
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
          ? job.savedBy.filter((uId) => uId !== user?._id)
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
          user={user}
          isRecruiter={isRecruiter}
          isAdmin={isAdmin}
          canEdit={canEdit}
          canDelete={canDelete}
          handleSave={handleSave}
          navigate={navigate}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />

        <div className="card-body p-4 p-md-5">
          <div className="row g-5">
            <div className="col-lg-8">
              <section>
                <h2 className="h4 fw-bold text-body mb-4">Job details</h2>
                <div className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                  <p className="m-0" dir="auto" style={{ whiteSpace: 'pre-wrap' }}>{job.description || 'No additional description was collected for this posting.'}</p>
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
