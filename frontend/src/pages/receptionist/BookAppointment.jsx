import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { receptionistApi } from '../../api/receptionistApi';
import { adminApi } from '../../api/adminApi';
import { commonApi } from '../../api/commonApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, Clock, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';

const BookAppointment = () => {
  const location = useLocation();
  const preselectedPatientId = location.state?.patientId || '';

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Booking Form State
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [patRes, deptRes, apptRes] = await Promise.all([
        receptionistApi.searchPatients(''),
        commonApi.getDepartments(),
        adminApi.getAllAppointments()
      ]);
      if (patRes.success) setPatients(patRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
      if (apptRes.success) setRecentAppointments(apptRes.data);
    } catch (err) {
      setError(err.message || 'Failed to initialize booking data');
    } finally {
      setLoading(false);
    }
  };

  // When department changes, load filtered doctors
  useEffect(() => {
    if (departmentId) {
      loadDoctors(departmentId);
    } else {
      setDoctors([]);
      setDoctorId('');
      setAvailableSlots([]);
    }
  }, [departmentId]);

  const loadDoctors = async (deptId) => {
    try {
      const res = await commonApi.getDoctors(deptId);
      if (res.success) {
        setDoctors(res.data);
        if (res.data.length > 0) {
          setDoctorId(res.data[0].id);
        } else {
          setDoctorId('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When doctor or date changes, load available slots from backend
  useEffect(() => {
    if (doctorId && appointmentDate) {
      fetchAvailableSlots(doctorId, appointmentDate);
    } else {
      setAvailableSlots([]);
    }
  }, [doctorId, appointmentDate]);

  const fetchAvailableSlots = async (docId, date) => {
    setLoadingSlots(true);
    setAppointmentTime('');
    try {
      const res = await commonApi.getAvailableSlots(docId, date);
      if (res.success) {
        setAvailableSlots(res.data);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!appointmentTime) {
      setError('Please select an available time slot pill.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        patientId: Number(patientId),
        departmentId: Number(departmentId),
        doctorId: Number(doctorId),
        appointmentDate,
        appointmentTime,
        reason,
      };

      const res = await receptionistApi.bookAppointment(payload);
      if (res.success) {
        setSuccess(`Appointment ${res.data.appointmentNumber} confirmed for ${appointmentDate} at ${appointmentTime}!`);
        setReason('');
        setAppointmentTime('');
        // Refresh recent appointments & slots
        const apptRes = await adminApi.getAllAppointments();
        if (apptRes.success) setRecentAppointments(apptRes.data);
        fetchAvailableSlots(doctorId, appointmentDate);
      }
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openRescheduleModal = async (appt) => {
    setRescheduleTarget(appt);
    setNewDate(appt.appointmentDate);
    setNewTime('');
    setIsRescheduleModalOpen(true);

    try {
      const res = await commonApi.getAvailableSlots(appt.doctorId, appt.appointmentDate);
      if (res.success) setRescheduleSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleDateChange = async (date) => {
    setNewDate(date);
    setNewTime('');
    if (rescheduleTarget) {
      try {
        const res = await commonApi.getAvailableSlots(rescheduleTarget.doctorId, date);
        if (res.success) setRescheduleSlots(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExecuteReschedule = async (e) => {
    e.preventDefault();
    if (!newTime) {
      setError('Please pick a time slot for reschedule');
      return;
    }

    try {
      await receptionistApi.rescheduleAppointment(rescheduleTarget.id, {
        appointmentDate: newDate,
        appointmentTime: newTime,
      });
      setSuccess(`Appointment rescheduled to ${newDate} at ${newTime}!`);
      setIsRescheduleModalOpen(false);
      const apptRes = await adminApi.getAllAppointments();
      if (apptRes.success) setRecentAppointments(apptRes.data);
    } catch (err) {
      setError(err.message || 'Failed to reschedule');
    }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Please enter cancellation reason:', 'Patient requested cancellation');
    if (reason === null) return;

    try {
      await receptionistApi.cancelAppointment(id, reason);
      setSuccess('Appointment cancelled successfully.');
      const apptRes = await adminApi.getAllAppointments();
      if (apptRes.success) setRecentAppointments(apptRes.data);
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
      header: 'Patient Info',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.patientName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{row.patientPhone}</div>
        </div>
      ),
    },
    {
      header: 'Doctor',
      render: (row) => <span>{row.doctorName} ({row.departmentName})</span>,
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div>
          <div>{row.appointmentDate}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>{row.appointmentTime}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
            <>
              <button
                onClick={() => openRescheduleModal(row)}
                className="btn btn-secondary btn-sm"
                title="Change date or time"
              >
                <RefreshCw size={13} />
                <span>Reschedule</span>
              </button>
              <button
                onClick={() => handleCancel(row.id)}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--danger-solid)', borderColor: 'var(--danger-border)' }}
                title="Cancel booking"
              >
                <XCircle size={13} />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text="Loading appointment scheduling system..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Schedule Patient Appointments</h1>
          <p>Book real-time OPD slots with automated backend double-booking prevention</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>New Appointment Booking Form</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleBook}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Patient *</label>
                <select
                  className="form-control"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone || p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Department *</label>
                <select
                  className="form-control"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Doctor *</label>
                <select
                  className="form-control"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                  disabled={!departmentId}
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fullName} (Fee: ₹{doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Consultation Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">
                  Available Slots for Selected Doctor ({availableSlots.length} Openings) *
                </label>
                {loadingSlots ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', padding: '0.5rem' }}>
                    Checking doctor schedule...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--danger-solid)', padding: '0.5rem' }}>
                    No available time slots for this doctor on the selected date. Please pick another date.
                  </div>
                ) : (
                  <div className="slot-grid">
                    {availableSlots.map((slot, index) => (
                      <button
                        type="button"
                        key={index}
                        className={`slot-pill ${appointmentTime === slot ? 'selected' : ''}`}
                        onClick={() => setAppointmentTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Visit / Symptoms</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Chest discomfort, routine checkup, follow-up"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !appointmentTime}
              >
                <Calendar size={16} />
                <span>{submitting ? 'Verifying & Booking...' : 'Confirm Appointment Booking'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Bookings & Management ({recentAppointments.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={recentAppointments}
            emptyMessage="No recent appointments logged."
          />
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title={`Reschedule: ${rescheduleTarget?.appointmentNumber}`}
        maxWidth="600px"
      >
        <form onSubmit={handleExecuteReschedule}>
          <div className="form-group">
            <label className="form-label">New Date *</label>
            <input
              type="date"
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
              value={newDate}
              onChange={(e) => handleRescheduleDateChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Slots for New Date *</label>
            <div className="slot-grid">
              {rescheduleSlots.map((slot, index) => (
                <button
                  type="button"
                  key={index}
                  className={`slot-pill ${newTime === slot ? 'selected' : ''}`}
                  onClick={() => setNewTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!newTime}>
              Save New Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookAppointment;
