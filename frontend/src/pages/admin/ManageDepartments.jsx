import React, { useState, useEffect } from 'react';
import { commonApi } from '../../api/commonApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Plus, Layers } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await commonApi.getAllDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await commonApi.createDepartment({ name, description });
      if (res.success) {
        setSuccess(`Department "${name}" created successfully!`);
        setIsModalOpen(false);
        setName('');
        setDescription('');
        fetchDepartments();
      }
    } catch (err) {
      setError(err.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Department Name',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{row.name}</span>
      ),
    },
    {
      header: 'Clinical Scope / Description',
      render: (row) => (
        <span style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>{row.description || 'No description provided'}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.active ? 'ACTIVE' : 'CANCELLED'} />,
    },
    {
      header: 'Created On',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Clinical Departments</h1>
          <p>Organize hospital specialized clinics, medical units, and doctor specialties</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Department Directory ({departments.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading departments..." />
          ) : (
            <DataTable columns={columns} data={departments} emptyMessage="No departments found." />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Clinical Department"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Oncology, Ophthalmology"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe primary clinical focus, diagnostic facilities, and treatment procedures"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Department...' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDepartments;
