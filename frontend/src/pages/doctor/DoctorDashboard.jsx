import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, CheckCircle2, Clock, Activity, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, todayRes] = await Promise.all([
        doctorApi.getDashboard(),
        doctorApi.getTodayAppointments()
      ]);
      if (dashRes.success) setData(dashRes.data);
      if (todayRes.success) setTodayAppts(todayRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load doctor dashboard');
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
      header: 'Patient Name & Phone',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.patientName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.patientPhone}</div>
        </div>
      ),
    },
    {
      header: 'Slot Time',
      render: (row) => (
        <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
          {row.appointmentTime}
        </div>
      ),
    },
    {
      header: 'Chief Complaint',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {row.reason || 'Routine Consultation'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Action',
      render: (row) => (
        <Link to="/doctor/appointments" className="btn btn-outline btn-sm">
          <span>Consult</span>
          <ArrowRight size={14} />
        </Link>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text="Loading your clinical appointments..." />;

  const doc = data?.doctorInfo;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {doc?.fullName || 'Doctor'}</h1>
          <p>
            {doc?.specialization} | Department of {doc?.departmentName} | Cabin: {doc?.roomNumber || 'Room 101'}
          </p>
        </div>
        <Link to="/doctor/appointments" className="btn btn-primary">
          <Calendar size={16} />
          <span>Go to Appointments Queue</span>
        </Link>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="stats-grid">
        <StatCard
          title="Today's Appointments"
          value={data?.todayAppointmentsCount}
          icon={Calendar}
          variant="primary"
          subtitle="Consultations for today"
        />
        <StatCard
          title="Pending / Booked"
          value={data?.pendingCount}
          icon={Clock}
          variant="warning"
          subtitle="Awaiting consultation"
        />
        <StatCard
          title="Completed Cases"
          value={data?.completedCount}
          icon={CheckCircle2}
          variant="success"
          subtitle="Diagnosed and prescribed"
        />
        <StatCard
          title="Total Patient History"
          value={data?.totalAppointmentsCount}
          icon={Activity}
          variant="accent"
          subtitle="Cumulative consultations"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Today's Consultation Schedule ({todayAppts.length})</h2>
          <Link to="/doctor/appointments" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
            View Full Queue →
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={todayAppts}
            emptyMessage="No consultations scheduled for today."
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
