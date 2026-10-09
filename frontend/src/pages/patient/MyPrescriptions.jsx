import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Pill, Stethoscope, Calendar, Clock, AlertCircle } from 'lucide-react';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getPrescriptions();
      if (res.success) setPrescriptions(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading digital prescriptions..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Digital Prescriptions</h1>
          <p>Review active and historical doctor medication instructions, intake frequencies, and durations</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      {prescriptions.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <Pill size={44} />
              <h4>No Prescriptions on File</h4>
              <p>Your physician has not issued any medications yet.</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {prescriptions.map((rx) => (
            <div key={rx.id} className="card">
              <div className="card-header" style={{ backgroundColor: 'var(--slate-50)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--success-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success-solid)'
                  }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Prescription #{rx.prescriptionNumber}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Appointment: <strong>{rx.appointmentNumber}</strong> • Prescribed on {new Date(rx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{rx.doctorName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>
                    {rx.doctorSpecialization}
                  </div>
                </div>
              </div>

              <div className="card-body">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-500)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Medicine Name</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Dosage</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Frequency</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Duration</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines?.map((med, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                          {med.medicineName}
                        </td>
                        <td style={{ padding: '0.75rem' }}>{med.dosage}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ backgroundColor: 'var(--slate-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                            {med.frequency}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{med.duration}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                          {med.instructions || 'As advised'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {rx.notes && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    fontSize: '0.85rem',
                    color: 'var(--slate-600)'
                  }}>
                    <strong>Physician Advice:</strong> {rx.notes}
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

export default MyPrescriptions;
