import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Users, Search, Phone, Mail, Droplet } from 'lucide-react';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllPatients();
      if (res.success) setPatients(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  });

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
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.address || 'Address not listed'}</div>
        </div>
      ),
    },
    {
      header: 'Blood Group & Gender',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--danger-solid)' }}>{row.bloodGroup || 'N/A'}</span>
          <span style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}> | {row.gender || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'DOB & Age',
      render: (row) => <span>{row.dateOfBirth || 'N/A'}</span>,
    },
    {
      header: 'Emergency Contact',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {row.emergencyContact || 'None provided'}
        </span>
      ),
    },
    {
      header: 'Medical Alerts / History',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          {row.medicalHistorySummary || 'No chronic conditions noted'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Registered Patients</h1>
          <p>Hospital master directory of registered patients and medical demographics</p>
        </div>
        <div style={{ width: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Patient Records ({filteredPatients.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading patients..." />
          ) : (
            <DataTable
              columns={columns}
              data={filteredPatients}
              emptyMessage="No matching patients found."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;
