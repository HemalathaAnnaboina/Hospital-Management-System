import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Please enter the reason for cancellation:');
    if (reason === null) return;

    try {
      await patientApi.cancelAppointment(id, reason || 'Cancelled by patient');
      setSuccess('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
    }
  };

  const columns = [
    {
      header: 'Appt Number',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'monospace' }}>
          {row.appointmentNumber}
        </span>
      ),
    },
    {
      header: 'Doctor & Department',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.doctorName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {row.specialization} ({row.departmentName})
          </div>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div>
          <div>{row.appointmentDate}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            {row.appointmentTime}
          </div>
        </div>
      ),
    },
    {
      header: 'Consultation Fee & Room',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>₹{row.consultationFee}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Room: {row.roomNumber || '101'}</div>
        </div>
      ),
    },
    {
      header: 'Reason / Notes',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {row.reason || 'Routine consultation'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div>
          {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
            <button
              onClick={() => handleCancel(row.id)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger-solid)', borderColor: 'var(--danger-border)' }}
            >
              <XCircle size={14} />
              <span>Cancel</span>
            </button>
          )}
          {row.status === 'COMPLETED' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--success-solid)', fontWeight: 600 }}>
              ✓ Completed
            </span>
          )}
          {row.status === 'CANCELLED' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
              Cancelled
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Scheduled Appointments</h1>
          <p>Review active consultations, doctor details, and past visit history</p>
        </div>
        <Link to="/patient/book-appointment" className="btn btn-primary">
          <Calendar size={16} />
          <span>Book Another Slot</span>
        </Link>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Appointments Log ({appointments.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading appointment bookings..." />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              emptyMessage="You have no appointment bookings on record."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
