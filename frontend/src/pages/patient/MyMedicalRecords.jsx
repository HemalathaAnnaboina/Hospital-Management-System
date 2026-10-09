import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { FolderHeart, Stethoscope, Calendar, FileText } from 'lucide-react';

const MyMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getMedicalRecords();
      if (res.success) setRecords(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving your medical history..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Medical & Diagnostic Records</h1>
          <p>Access doctor diagnoses, clinical assessments, symptoms, and physician follow-up advice</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      {records.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <FolderHeart size={44} />
              <h4>No Medical Records Found</h4>
              <p>You do not have any clinical consultation records logged yet.</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {records.map((r) => (
            <div key={r.id} className="card">
              <div className="card-header" style={{ backgroundColor: 'var(--slate-50)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-700)'
                  }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{r.diagnosis}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Record Reference: <strong>{r.recordNumber}</strong> • Appointment: {r.appointmentNumber}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.9rem' }}>
                    {r.doctorName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>
                    {r.doctorSpecialization}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    Reported Symptoms
                  </h4>
                  <p style={{ color: 'var(--slate-800)', fontSize: '0.95rem', backgroundColor: 'var(--slate-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    {r.symptoms}
                  </p>
                </div>

                {r.notes && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                      Physician Notes & Instructions
                    </h4>
                    <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', backgroundColor: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
                      {r.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMedicalRecords;
