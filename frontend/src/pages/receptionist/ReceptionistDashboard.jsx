import React, { useState, useEffect } from 'react';
import { receptionistApi } from '../../api/receptionistApi';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { UserPlus, Calendar, CreditCard, Search, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReceptionistDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await receptionistApi.getDashboard();
      if (res.success) setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load front desk data');
    } finally {
      setLoading(false);
    }
  };

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
      header: 'Patient Info',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.patientName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.patientPhone}</div>
        </div>
      ),
    },
    {
      header: 'Doctor & Dept',
      render: (row) => (
        <div>
          <div>{row.doctorName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.departmentName}</div>
        </div>
      ),
    },
    {
      header: 'Time Slot',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.appointmentTime}</span>,
    },
    {
      header: 'Room',
      render: (row) => <span>{row.roomNumber || 'Room 101'}</span>,
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
  ];

  if (loading) return <LoadingSpinner text="Loading front-desk operations..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Front Desk Reception</h1>
          <p>Hospital registration counter, OPD patient flow, slot scheduling, and billing</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/receptionist/register-patient" className="btn btn-primary">
            <UserPlus size={16} />
            <span>Register Walk-in Patient</span>
          </Link>
          <Link to="/receptionist/book-appointment" className="btn btn-secondary">
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={data?.totalPatients}
          icon={UserPlus}
          variant="primary"
          subtitle="Hospital database"
        />
        <StatCard
          title="Today's Bookings"
          value={data?.todayAppointmentsCount}
          icon={Calendar}
          variant="accent"
          subtitle="OPD queue today"
        />
        <StatCard
          title="Pending Check-ins"
          value={data?.todayPendingCount}
          icon={Clock}
          variant="warning"
          subtitle="Waiting in queue"
        />
        <StatCard
          title="Consulted & Finished"
          value={data?.todayCompletedCount}
          icon={CheckCircle}
          variant="success"
          subtitle="Completed visits"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Today's Patient Queue ({data?.todayAppointments?.length || 0})</h2>
          <Link to="/receptionist/book-appointment" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
            Schedule New Patient →
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={data?.todayAppointments || []}
            emptyMessage="No appointments scheduled for today."
          />
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
