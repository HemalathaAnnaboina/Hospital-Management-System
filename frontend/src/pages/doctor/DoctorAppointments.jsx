import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { commonApi } from '../../api/commonApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import {
  FileText,
  FolderHeart,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  Clock,
  User,
  Pill,
  Send
} from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Consultation Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([
    {
      medicineId: null,
      medicineName: 'Paracetamol 500mg',
      dosage: '1 tablet (500mg)',
      frequency: '1-0-1 (After Food)',
      duration: '5 Days',
      instructions: 'Take after meals',
    },
  ]);

  // Patient History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyPrescriptions, setHistoryPrescriptions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchAppointments();
    loadMedicines();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.getAllAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicines = async () => {
    try {
      const res = await commonApi.getMedicines();
      if (res.success) setMedicinesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await doctorApi.updateStatus(id, newStatus);
      setSuccess(`Appointment status updated to ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const openConsultation = (appt) => {
    setSelectedAppt(appt);
    setSymptoms(appt.reason || '');
    setDiagnosis('');
    setClinicalNotes('');
    setPrescriptionMedicines([
      {
        medicineId: null,
        medicineName: 'Paracetamol 500mg',
        dosage: '1 tablet (500mg)',
        frequency: '1-0-1 (After Meals)',
        duration: '5 Days',
        instructions: 'Take with warm water',
      },
    ]);
    setIsConsultModalOpen(true);
  };

  const openPatientHistory = async (appt) => {
    setHistoryPatient(appt);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const [recRes, rxRes] = await Promise.all([
        doctorApi.getPatientRecords(appt.patientId),
        doctorApi.getPatientPrescriptions(appt.patientId),
      ]);
      if (recRes.success) setHistoryRecords(recRes.data);
      if (rxRes.success) setHistoryPrescriptions(rxRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load patient history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAddMedicineRow = () => {
    setPrescriptionMedicines([
      ...prescriptionMedicines,
      {
        medicineId: null,
        medicineName: '',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '5 Days',
        instructions: '',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    setPrescriptionMedicines(prescriptionMedicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionMedicines];
    updated[index][field] = value;

    if (field === 'medicineName') {
      const matched = medicinesList.find(
        (m) => m.name.toLowerCase() === value.toLowerCase()
      );
      if (matched) {
        updated[index].medicineId = matched.id;
        updated[index].dosage = matched.strength || '1 unit';
      }
    }

    setPrescriptionMedicines(updated);
  };

  const handleCompleteConsultation = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // 1. Create Medical Record (marks appointment COMPLETED)
      await doctorApi.createMedicalRecord({
        appointmentId: selectedAppt.id,
        symptoms,
        diagnosis,
        notes: clinicalNotes,
      });

      // 2. Create Prescription if medicines added
      if (prescriptionMedicines.length > 0 && prescriptionMedicines[0].medicineName) {
        await doctorApi.createPrescription({
          appointmentId: selectedAppt.id,
          notes: `Follow-up instructions: ${clinicalNotes}`,
          medicines: prescriptionMedicines,
        });
      }

      setSuccess(`Consultation for ${selectedAppt.patientName} completed successfully!`);
      setIsConsultModalOpen(false);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to complete consultation');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Appt # & Date',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'monospace' }}>
            {row.appointmentNumber}
          </span>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {row.appointmentDate} at {row.appointmentTime}
          </div>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{row.patientName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.patientPhone}</div>
        </div>
      ),
    },
    {
      header: 'Reason / Chief Complaint',
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
    {
      header: 'Patient History',
      render: (row) => (
        <button
          onClick={() => openPatientHistory(row)}
          className="btn btn-secondary btn-sm"
          title="View medical records & past prescriptions"
        >
          <FolderHeart size={14} color="var(--primary-600)" />
          <span>Past Records</span>
        </button>
      ),
    },
    {
      header: 'Consultation Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
            <button
              onClick={() => openConsultation(row)}
              className="btn btn-primary btn-sm"
            >
              <FileText size={14} />
              <span>Consult & Prescribe</span>
            </button>
          )}

          {row.status === 'BOOKED' && (
            <button
              onClick={() => handleStatusChange(row.id, 'CONFIRMED')}
              className="btn btn-secondary btn-sm"
            >
              <span>Confirm</span>
            </button>
          )}

          {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
            <button
              onClick={() => handleStatusChange(row.id, 'CANCELLED')}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger-solid)', borderColor: 'var(--danger-border)' }}
            >
              <span>Cancel</span>
            </button>
          )}

          {row.status === 'COMPLETED' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--success-solid)', fontWeight: 600 }}>
              ✓ Completed
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
          <h1>Doctor Consultations & Appointments</h1>
          <p>Manage patient queue, conduct diagnostic consultations, and issue digital prescriptions</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Appointments Queue ({appointments.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading appointment queue..." />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              emptyMessage="No appointments scheduled for you."
            />
          )}
        </div>
      </div>

      {/* Consultation & Prescription Modal */}
      <Modal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        title={`Clinical Consultation: ${selectedAppt?.patientName || ''}`}
        maxWidth="850px"
      >
        <form onSubmit={handleCompleteConsultation}>
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid var(--slate-200)'
          }}>
            <div>
              <strong>Appt Number:</strong> {selectedAppt?.appointmentNumber} |{' '}
              <strong>Date:</strong> {selectedAppt?.appointmentDate} at {selectedAppt?.appointmentTime}
            </div>
            <div>
              <strong>Contact:</strong> {selectedAppt?.patientPhone}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms & Clinical Presentation *</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. High fever for 3 days, dry cough, headache, body aches"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Diagnosis & Findings *</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Acute Upper Respiratory Tract Infection (URTI)"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Notes & Patient Advice</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Drink warm fluids, avoid cold exposure, report back if fever persists after 48 hrs"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
            />
          </div>

          {/* Prescription Medicines Block */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <Pill size={18} color="var(--primary-600)" />
                <span>Prescribed Medications ({prescriptionMedicines.length})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="btn btn-outline btn-sm"
              >
                <Plus size={14} />
                <span>Add Medicine</span>
              </button>
            </div>

            {prescriptionMedicines.map((med, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  backgroundColor: '#ffffff'
                }}
              >
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Paracetamol 500mg"
                      list="medicines-list"
                      value={med.medicineName}
                      onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Dosage *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 500mg or 1 tablet"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Frequency *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1-0-1 (After Food)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Duration *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 5 Days, 1 Week"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Instructions / Intake</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Take with warm water after meals"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      />
                      {prescriptionMedicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(index)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger-solid)', borderColor: 'var(--danger-border)' }}
                          title="Remove medicine"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <datalist id="medicines-list">
              {medicinesList.map((m) => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsConsultModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Send size={16} />
              <span>{submitting ? 'Submitting Consultation...' : 'Complete & Issue Prescription'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient Past Medical History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`Medical History: ${historyPatient?.patientName || ''}`}
        maxWidth="800px"
      >
        {loadingHistory ? (
          <LoadingSpinner text="Retrieving patient records..." />
        ) : (
          <div>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--slate-800)' }}>Previous Clinical Records ({historyRecords.length})</h4>
            {historyRecords.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                No prior consultation records logged for this patient.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {historyRecords.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{r.recordNumber}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {new Date(r.createdAt).toLocaleDateString()} by {r.doctorName}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                      <strong>Diagnosis:</strong> {r.diagnosis}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '0.35rem' }}>
                      <strong>Symptoms:</strong> {r.symptoms}
                    </div>
                    {r.notes && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                        <strong>Notes:</strong> {r.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h4 style={{ marginBottom: '0.75rem', color: 'var(--slate-800)' }}>Prior Prescriptions ({historyPrescriptions.length})</h4>
            {historyPrescriptions.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                No past prescriptions on file.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {historyPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-600)' }}>{rx.prescriptionNumber}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                      {rx.medicines?.map((m) => (
                        <li key={m.id} style={{ marginBottom: '0.25rem' }}>
                          <strong>{m.medicineName}</strong> - {m.dosage} | {m.frequency} for {m.duration}
                          {m.instructions ? ` (${m.instructions})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
