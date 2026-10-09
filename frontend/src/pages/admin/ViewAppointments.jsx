import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, Filter } from 'lucide-react';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  const columns = [
    {
      header: 'Appt #',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'monospace' }}>
          {row.appointmentNumber}
        </span>
      ),
    },
    {
      header: 'Patient Name & Phone',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.patientName || 'N/A'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.patientPhone}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Doctor',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.doctorName || 'N/A'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {row.specialization} ({row.departmentName})
          </div>
        </div>
      ),
    },
    {
      header: 'Schedule & Time',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.appointmentDate}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            {row.appointmentTime}
          </div>
        </div>
      ),
    },
    {
      header: 'Fee & Room',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>₹{row.consultationFee}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.roomNumber || 'Room N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Reason',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {row.reason || 'General Consultation'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Master Appointment Schedule</h1>
          <p>Complete hospital appointments register across all departments and doctors</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--slate-500)" />
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKED">Booked</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Appointments Log ({filteredAppointments.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading appointment schedule..." />
          ) : (
            <DataTable
              columns={columns}
              data={filteredAppointments}
              emptyMessage="No appointments found for selected filter."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;
