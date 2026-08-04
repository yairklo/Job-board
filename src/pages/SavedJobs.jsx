import React, { useState, useEffect } from 'react';
import { getAllJobs, toggleSaveJob } from '../services/jobsService';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';
import { FiBookmark } from 'react-icons/fi';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setIsLoading(true);
        // Ideally there would be a /jobs/saved endpoint, but since we are told to filter client-side 
        // if we fetch all, or let's assume we can fetch all and filter where job.savedBy.includes(user._id).
        // Wait, the spec says "Filter jobs where job.savedBy.includes(user._id). Removing a job instantly drops it from view."
        
        const data = await getAllJobs();
        const jobsArray = Array.isArray(data) ? data : data.docs || [];
        
        const filtered = jobsArray.filter(job => job.savedBy?.includes(user?._id));
        setSavedJobs(filtered);
      } catch (error) {
        toast.error('Failed to load saved jobs');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?._id) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleUnsaveJob = async (jobId) => {
    try {
      await toggleSaveJob(jobId);
      // Remove instantly from view
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="display-6 fw-bold text-body d-flex align-items-center">
          <FiBookmark className="me-3 text-primary" />
          Saved Jobs
        </h1>
        <p className="text-secondary mt-2">
          Manage the opportunities you've bookmarked.
        </p>
      </div>

      {isLoading ? (
        <div className="row g-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <JobCardSkeleton />
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState 
          title="No saved jobs" 
          message="You haven't saved any jobs yet. Browse the job board and bookmark opportunities you're interested in."
          icon={FiBookmark}
        />
      ) : (
        <div className="row g-4">
          {savedJobs.map(job => (
            <div className="col-12 col-md-6 col-lg-4" key={job._id}>
              <JobCard 
                job={job} 
                onSave={handleUnsaveJob}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
