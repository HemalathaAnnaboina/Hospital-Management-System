import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Stethoscope, Users, Calendar, CheckCircle, Clock, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load hospital statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading hospital overview..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hospital Administration</h1>
          <p>Real-time hospital operations, medical staff, and patient appointment tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/doctors" className="btn btn-primary">
            <Stethoscope size={16} />
            <span>Manage Doctors</span>
          </Link>
          <Link to="/admin/departments" className="btn btn-secondary">
            <Layers size={16} />
            <span>Departments</span>
          </Link>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="stats-grid">
        <StatCard
          title="Active Doctors"
          value={stats?.totalDoctors}
          icon={Stethoscope}
          variant="primary"
          subtitle="Clinical medical staff"
        />
        <StatCard
          title="Registered Patients"
          value={stats?.totalPatients}
          icon={Users}
          variant="accent"
          subtitle="Patients on record"
        />
        <StatCard
          title="Today's Appointments"
          value={stats?.todayAppointments}
          icon={Calendar}
          variant="warning"
          subtitle="Scheduled consultations"
        />
        <StatCard
          title="Completed Consultations"
          value={stats?.completedAppointments}
          icon={CheckCircle}
          variant="success"
          subtitle="Finished treatments"
        />
        <StatCard
          title="Pending Appointments"
          value={stats?.pendingAppointments}
          icon={Clock}
          variant="warning"
          subtitle="Booked or confirmed"
        />
        <StatCard
          title="Medical Departments"
          value={stats?.totalDepartments}
          icon={Layers}
          variant="primary"
          subtitle="Specialized clinics"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Administrative Quick Operations</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Doctors & Medical Staff</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                Onboard doctors, configure consultation fees, update room numbers, and manage availability schedules.
              </p>
              <Link to="/admin/doctors" className="btn btn-outline btn-sm">
                <span>View Doctor Directory</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Hospital Appointments Master</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                Monitor the centralized appointment calendar across all doctors, departments, and consultation queues.
              </p>
              <Link to="/admin/appointments" className="btn btn-outline btn-sm">
                <span>View All Appointments</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Clinical Departments</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                Set up new medical units like Cardiology, Neurology, Pediatrics, Orthopedics, and Radiology.
              </p>
              <Link to="/admin/departments" className="btn btn-outline btn-sm">
                <span>Manage Departments</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
