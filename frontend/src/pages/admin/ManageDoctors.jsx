import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { commonApi } from '../../api/commonApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Plus, Stethoscope, Power, CheckCircle, Clock } from 'lucide-react';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 500,
    roomNumber: '',
    availableDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
    availableFrom: '09:00',
    availableTo: '17:00',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsRes, deptsRes] = await Promise.all([
        adminApi.getAllDoctors(),
        commonApi.getDepartments()
      ]);
      if (docsRes.success) setDoctors(docsRes.data);
      if (deptsRes.success) setDepartments(deptsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctor) => {
    try {
      if (doctor.active) {
        await adminApi.deactivateDoctor(doctor.id);
        setSuccess(`Dr. ${doctor.fullName} deactivated successfully`);
      } else {
        await adminApi.activateDoctor(doctor.id);
        setSuccess(`Dr. ${doctor.fullName} activated successfully`);
      }
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update doctor status');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        departmentId: Number(formData.departmentId),
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
      };

      const res = await adminApi.addDoctor(payload);
      if (res.success) {
        setSuccess('Doctor onboarded successfully!');
        setIsModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          departmentId: '',
          specialization: '',
          qualification: '',
          experienceYears: 5,
          consultationFee: 500,
          roomNumber: '',
          availableDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
          availableFrom: '09:00',
          availableTo: '17:00',
        });
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to onboard doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Doctor Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{row.fullName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.email} | {row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Department',
      render: (row) => <span>{row.departmentName || 'General'}</span>,
    },
    {
      header: 'Specialization & Qual.',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.specialization}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.qualification} ({row.experienceYears} yrs)</div>
        </div>
      ),
    },
    {
      header: 'Fee & Room',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>₹{row.consultationFee}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Room: {row.roomNumber || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Schedule',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div>{row.availableDays}</div>
          <div style={{ color: 'var(--slate-500)' }}>{row.availableFrom} - {row.availableTo}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.active ? 'ACTIVE' : 'CANCELLED'} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className={`btn btn-sm ${row.active ? 'btn-secondary' : 'btn-outline'}`}
        >
          <Power size={14} />
          <span>{row.active ? 'Deactivate' : 'Activate'}</span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Doctor Management</h1>
          <p>Register, update schedules, consultation fees, and active statuses</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Medical Staff Directory ({doctors.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading doctors..." />
          ) : (
            <DataTable columns={columns} data={doctors} emptyMessage="No doctors registered yet." />
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Onboard New Medical Doctor"
        maxWidth="700px"
      >
        <form onSubmit={handleCreateDoctor}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="Dr. Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Initial Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Clinical Department *</label>
              <select
                name="departmentId"
                className="form-control"
                value={formData.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input
                type="text"
                name="specialization"
                className="form-control"
                placeholder="e.g. Interventional Cardiologist"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <input
                type="text"
                name="qualification"
                className="form-control"
                placeholder="e.g. MBBS, MD, DM"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                className="form-control"
                value={formData.experienceYears}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Consultation Fee (₹) *</label>
              <input
                type="number"
                name="consultationFee"
                className="form-control"
                value={formData.consultationFee}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room / Cabin Number</label>
              <input
                type="text"
                name="roomNumber"
                className="form-control"
                placeholder="e.g. Room 205"
                value={formData.roomNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Days</label>
            <input
              type="text"
              name="availableDays"
              className="form-control"
              placeholder="e.g. Monday,Tuesday,Wednesday,Thursday,Friday"
              value={formData.availableDays}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Shift Start Time</label>
              <input
                type="time"
                name="availableFrom"
                className="form-control"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Shift End Time</label>
              <input
                type="time"
                name="availableTo"
                className="form-control"
                value={formData.availableTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering Doctor...' : 'Onboard Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
