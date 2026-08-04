import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const AdminUserTable = ({ users, isLoading, currentUser, confirmDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-secondary fw-medium text-uppercase small">User</th>
            <th scope="col" className="text-secondary fw-medium text-uppercase small">Contact</th>
            <th scope="col" className="text-secondary fw-medium text-uppercase small">Role</th>
            <th scope="col" className="text-secondary fw-medium text-uppercase small text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-5 text-secondary">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td className="py-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '40px', height: '40px' }}>
                      {u.image?.url ? (
                        <img className="w-100 h-100 object-fit-cover" src={u.image.url} alt="" />
                      ) : (
                        <span className="text-secondary fw-medium">{u.name?.first?.[0] || 'U'}</span>
                      )}
                    </div>
                    <div className="ms-3">
                      <div className="fw-medium text-body">
                        {u.name?.first} {u.name?.last} {u._id === currentUser?._id && '(You)'}
                      </div>
                      <div className="small text-secondary">ID: {u._id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="text-body">{u.email}</div>
                  <div className="small text-secondary">{u.phone || 'N/A'}</div>
                </td>
                <td className="py-3">
                  <span className={`badge rounded-pill px-2 py-1 fw-medium ${
                    u.isAdmin 
                      ? 'bg-danger bg-opacity-10 text-danger' 
                      : u.isRecruiter 
                        ? 'bg-info bg-opacity-10 text-info'
                        : 'bg-success bg-opacity-10 text-success'
                  }`}>
                    {u.isAdmin ? 'Admin' : u.isRecruiter ? 'Recruiter' : 'User'}
                  </span>
                </td>
                <td className="py-3 text-end">
                  {!u.isAdmin && u._id !== currentUser?._id && (
                    <button
                      onClick={() => confirmDelete(u._id)}
                      className="btn btn-link text-danger text-decoration-none p-0 d-inline-flex align-items-center"
                    >
                      <FiTrash2 className="me-1" /> Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
