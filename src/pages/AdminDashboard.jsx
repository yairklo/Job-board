import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/usersService';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import AdminUserTable from '../components/AdminUserTable';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';
import { FiUsers, FiSearch, FiShield } from 'react-icons/fi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Ideally pass limit, page, search to the API
        const data = await getAllUsers({ page: currentPage, limit, search });
        if (Array.isArray(data)) {
          setUsers(data);
          setTotalPages(1);
        } else if (data && data.docs) {
          setUsers(data.docs);
          setTotalPages(data.totalPages || 1);
        } else {
          setUsers([]);
        }
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add debounce to search
    const handler = setTimeout(() => {
      fetchUsers();
    }, 300);
    
    return () => clearTimeout(handler);
  }, [currentPage, search]);

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setUsers(prev => prev.filter(u => u._id !== userToDelete));
      toast.success('User deleted successfully');
      
      // Auto-adjust page if empty
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="display-6 fw-bold text-body d-flex align-items-center">
          <FiShield className="me-3 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-secondary mt-2">
          Manage system users and their permissions.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <h2 className="h5 fw-bold text-body mb-0 d-flex align-items-center">
            <FiUsers className="me-2 text-secondary" /> All Users
          </h2>
          
          <div className="position-relative w-100" style={{ maxWidth: '300px' }}>
            <FiSearch className="position-absolute top-50 translate-middle-y text-secondary ms-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="form-control ps-5"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <AdminUserTable 
          users={users} 
          isLoading={isLoading} 
          currentUser={currentUser} 
          confirmDelete={confirmDelete} 
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? All their posted jobs (if any) and data will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}
        confirmText="Delete User"
      />
    </div>
  );
};

export default AdminDashboard;
