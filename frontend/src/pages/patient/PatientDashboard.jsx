import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, FolderHeart, Pill, CreditCard, ArrowRight, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getDashboard();
      if (res.success) setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load patient dashboard');
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
      header: 'Room',
      render: (row) => <span>{row.roomNumber || 'Room 101'}</span>,
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
  ];

  if (loading) return <LoadingSpinner text="Loading patient portal..." />;

  const profile = data?.profile;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {profile?.fullName || 'Patient'}</h1>
          <p>
            Patient ID: #{profile?.id} | Blood Group: {profile?.bloodGroup || 'Not specified'} | Contact: {profile?.phone || 'N/A'}
          </p>
        </div>
        <Link to="/patient/book-appointment" className="btn btn-primary">
          <Plus size={16} />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="stats-grid">
        <StatCard
          title="Total Appointments"
          value={data?.totalAppointments}
          icon={Calendar}
          variant="primary"
          subtitle="Consultations booked"
        />
        <StatCard
          title="Medical Records"
          value={data?.totalRecords}
          icon={FolderHeart}
          variant="accent"
          subtitle="Doctor diagnostic reports"
        />
        <StatCard
          title="Digital Prescriptions"
          value={data?.totalPrescriptions}
          icon={Pill}
          variant="success"
          subtitle="Medications & dosages"
        />
        <StatCard
          title="Hospital Bills"
          value={data?.totalBills}
          icon={CreditCard}
          variant="warning"
          subtitle="OPD receipts & invoices"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>Patient Care Quick Actions</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Link to="/patient/book-appointment" className="nav-item" style={{ border: '1px solid var(--slate-200)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Calendar size={20} color="var(--primary-600)" />
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Book a Doctor</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Filter doctors by department, view consultation fee, and reserve available time slots.
              </p>
            </Link>

            <Link to="/patient/my-records" className="nav-item" style={{ border: '1px solid var(--slate-200)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <FolderHeart size={20} color="var(--accent-600)" />
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Clinical Records</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Access diagnoses, physician observations, symptoms, and visit history.
              </p>
            </Link>

            <Link to="/patient/my-prescriptions" className="nav-item" style={{ border: '1px solid var(--slate-200)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Pill size={20} color="var(--success-solid)" />
                <h4 style={{ margin: 0, fontSize: '1rem' }}>My Prescriptions</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                View medications, dosage instructions, and daily schedule prescribed by your doctor.
              </p>
            </Link>

            <Link to="/patient/my-bills" className="nav-item" style={{ border: '1px solid var(--slate-200)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <CreditCard size={20} color="var(--warning-solid)" />
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Bills & Receipts</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Review consultation invoices, test charges, pharmacy costs, and payment receipts.
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Consultation Bookings</h2>
          <Link to="/patient/my-appointments" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
            View All ({data?.totalAppointments}) →
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={data?.recentAppointments || []}
            emptyMessage="No consultation bookings yet. Click 'Book New Appointment' above to get started."
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
