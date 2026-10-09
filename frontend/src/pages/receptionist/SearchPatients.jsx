import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistApi } from '../../api/receptionistApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Search, Edit, Calendar, User } from 'lucide-react';

const SearchPatients = () => {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    gender: '',
    dateOfBirth: '',
    medicalHistorySummary: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients('');
  }, []);

  const fetchPatients = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await receptionistApi.searchPatients(searchQuery);
      if (res.success) setPatients(res.data);
    } catch (err) {
      setError(err.message || 'Failed to search patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients(query);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setEditFormData({
      fullName: patient.fullName || '',
      phone: patient.phone || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      bloodGroup: patient.bloodGroup || 'O+',
      gender: patient.gender || 'Male',
      dateOfBirth: patient.dateOfBirth || '',
      medicalHistorySummary: patient.medicalHistorySummary || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPatient) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await receptionistApi.updatePatient(editingPatient.id, editFormData);
      if (res.success) {
        setSuccess('Patient details updated successfully!');
        setIsEditModalOpen(false);
        fetchPatients(query);
      }
    } catch (err) {
      setError(err.message || 'Failed to update patient info');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Patient Info',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{row.fullName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Contact & Address',
      render: (row) => (
        <div>
          <div>{row.phone || 'N/A'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.address || 'No address'}</div>
        </div>
      ),
    },
    {
      header: 'Blood Group & Gender',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--danger-solid)' }}>{row.bloodGroup}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}> | {row.gender}</span>
        </div>
      ),
    },
    {
      header: 'Emergency Contact',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {row.emergencyContact || 'None listed'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => openEditModal(row)}
            className="btn btn-secondary btn-sm"
            title="Edit demographics"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => navigate('/receptionist/book-appointment', { state: { patientId: row.id, patientName: row.fullName } })}
            className="btn btn-primary btn-sm"
            title="Book appointment for this patient"
          >
            <Calendar size={14} />
            <span>Book Slot</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Search & Update Patients</h1>
          <p>Find registered patients by name, contact number, or email to view and update files</p>
        </div>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '360px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search name, phone, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            <span>Search</span>
          </button>
        </form>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Matching Patients ({patients.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Searching patients..." />
          ) : (
            <DataTable
              columns={columns}
              data={patients}
              emptyMessage="No patients found. Try a different search query."
            />
          )}
        </div>
      </div>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update Info: ${editingPatient?.fullName || ''}`}
        maxWidth="650px"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={editFormData.fullName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={editFormData.phone}
                onChange={handleEditChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-control" value={editFormData.gender} onChange={handleEditChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-control" value={editFormData.bloodGroup} onChange={handleEditChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Emergency Contact Info</label>
              <input
                type="text"
                name="emergencyContact"
                className="form-control"
                value={editFormData.emergencyContact}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={editFormData.address}
                onChange={handleEditChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Medical History / Allergies</label>
            <textarea
              name="medicalHistorySummary"
              className="form-control"
              rows={2}
              value={editFormData.medicalHistorySummary}
              onChange={handleEditChange}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Updates...' : 'Update Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SearchPatients;
