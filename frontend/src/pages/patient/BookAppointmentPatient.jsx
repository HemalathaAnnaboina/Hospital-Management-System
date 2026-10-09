import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import { commonApi } from '../../api/commonApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { Calendar, Stethoscope, Clock, CheckCircle2, User, Search, MapPin } from 'lucide-react';

const BookAppointmentPatient = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const deptRes = await commonApi.getDepartments();
      if (deptRes.success) {
        setDepartments(deptRes.data);
      }
      // Load all doctors initially
      loadDoctors('');
    } catch (err) {
      setError(err.message || 'Failed to load clinical departments');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async (deptId) => {
    try {
      const res = await commonApi.getDoctors(deptId || null);
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeptFilter = (deptId) => {
    setSelectedDeptId(deptId);
    setSelectedDoctor(null);
    setSelectedSlot('');
    setAvailableSlots([]);
    loadDoctors(deptId);
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setSelectedSlot('');
    if (appointmentDate) {
      fetchSlots(doc.id, appointmentDate);
    }
  };

  const handleDateChange = (date) => {
    setAppointmentDate(date);
    setSelectedSlot('');
    if (selectedDoctor) {
      fetchSlots(selectedDoctor.id, date);
    }
  };

  const fetchSlots = async (docId, date) => {
    setLoadingSlots(true);
    setSelectedSlot('');
    try {
      const res = await commonApi.getAvailableSlots(docId, date);
      if (res.success) {
        setAvailableSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }
    if (!selectedSlot) {
      setError('Please select an available appointment time slot pill.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        departmentId: selectedDoctor.departmentId,
        appointmentDate,
        appointmentTime: selectedSlot,
        reason,
      };

      const res = await patientApi.bookAppointment(payload);
      if (res.success) {
        setSuccess(`Appointment booked successfully! Reference: ${res.data.appointmentNumber}`);
        setTimeout(() => {
          navigate('/patient/my-appointments');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading doctors and departments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Book Doctor Consultation</h1>
          <p>Find doctors by medical specialty, view open time slots, and schedule your appointment</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Department Filter Pills */}
      <div style={{ marginBottom: '1.5rem', overflowX: 'auto', display: 'flex', gap: '0.5rem', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => handleDeptFilter('')}
          className={`slot-pill ${!selectedDeptId ? 'selected' : ''}`}
          style={{ whiteSpace: 'nowrap', padding: '0.55rem 1rem' }}
        >
          All Specialties
        </button>
        {departments.map((d) => (
          <button
            key={d.id}
            onClick={() => handleDeptFilter(d.id)}
            className={`slot-pill ${selectedDeptId === d.id ? 'selected' : ''}`}
            style={{ whiteSpace: 'nowrap', padding: '0.55rem 1rem' }}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Doctors Directory List */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--slate-800)' }}>
            Available Doctors ({doctors.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doctors.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                No active doctors found for the selected department.
              </p>
            ) : (
              doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoctor(doc)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: `2px solid ${selectedDoctor?.id === doc.id ? 'var(--primary-600)' : 'var(--slate-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    boxShadow: selectedDoctor?.id === doc.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>{doc.fullName}</h4>
                      <p style={{ color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.875rem' }}>
                        {doc.specialization} • {doc.departmentName}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      Fee: ₹{doc.consultationFee}
                    </span>
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--slate-600)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <strong>Qualification:</strong> {doc.qualification || 'MBBS'}
                    </div>
                    <div>
                      <strong>Experience:</strong> {doc.experienceYears} Years
                    </div>
                    <div>
                      <strong>Days:</strong> {doc.availableDays}
                    </div>
                    <div>
                      <strong>Hours:</strong> {doc.availableFrom} - {doc.availableTo}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slot Selection & Booking Form */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div className="card-header">
            <h2>Reserve Your Slot</h2>
          </div>
          <div className="card-body">
            {!selectedDoctor ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-400)' }}>
                <Stethoscope size={40} style={{ margin: '0 auto 0.75rem', color: 'var(--slate-300)' }} />
                <p>Please click on a doctor from the left list to check live slot availability.</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--slate-200)'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{selectedDoctor.fullName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    {selectedDoctor.specialization} ({selectedDoctor.departmentName})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600, marginTop: '0.25rem' }}>
                    Consultation Fee: ₹{selectedDoctor.consultationFee} | Room: {selectedDoctor.roomNumber || 'Room 101'}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Consultation Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Available Time Slots for {appointmentDate} *
                  </label>
                  {loadingSlots ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', padding: '0.5rem' }}>
                      Querying doctor slot schedule...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--danger-solid)', padding: '0.5rem' }}>
                      No available slots for this doctor on {appointmentDate}. Please pick another date.
                    </div>
                  ) : (
                    <div className="slot-grid">
                      {availableSlots.map((slot, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`slot-pill ${selectedSlot === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit / Symptoms</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mild headache, regular checkup..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  disabled={submitting || !selectedSlot}
                >
                  <CheckCircle2 size={16} />
                  <span>{submitting ? 'Confirming Reservation...' : 'Confirm Appointment'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPatient;
