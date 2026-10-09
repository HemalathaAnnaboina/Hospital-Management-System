import React, { useState, useEffect } from 'react';
import { receptionistApi } from '../../api/receptionistApi';
import { adminApi } from '../../api/adminApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { CreditCard, Plus, CheckCircle, Receipt, DollarSign, Filter } from 'lucide-react';

const ManageBilling = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Generate Bill Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [consultationFee, setConsultationFee] = useState(500);
  const [testCharges, setTestCharges] = useState(0);
  const [medicineCharges, setMedicineCharges] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Pay Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // View Invoice Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  useEffect(() => {
    fetchBills();
    loadLookupData();
  }, [filterStatus]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await receptionistApi.getAllBills(filterStatus || null);
      if (res.success) setBills(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const loadLookupData = async () => {
    try {
      const [patRes, apptRes] = await Promise.all([
        receptionistApi.searchPatients(''),
        adminApi.getAllAppointments()
      ]);
      if (patRes.success) setPatients(patRes.data);
      if (apptRes.success) setAppointments(apptRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        patientId: Number(patientId),
        appointmentId: appointmentId ? Number(appointmentId) : null,
        consultationFee: Number(consultationFee),
        testCharges: Number(testCharges),
        medicineCharges: Number(medicineCharges),
        otherCharges: Number(otherCharges),
        discount: Number(discount),
      };

      const res = await receptionistApi.generateBill(payload);
      if (res.success) {
        setSuccess(`Invoice ${res.data.billNumber} created with backend calculated total: ₹${res.data.totalAmount}!`);
        setIsGenerateModalOpen(false);
        setPatientId('');
        setAppointmentId('');
        fetchBills();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate bill');
    } finally {
      setSubmitting(false);
    }
  };

  const openPayModal = (bill) => {
    setSelectedBillForPay(bill);
    setPaymentMethod('CASH');
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!selectedBillForPay) return;

    try {
      const res = await receptionistApi.payBill(selectedBillForPay.id, paymentMethod);
      if (res.success) {
        setSuccess(`Payment for ${selectedBillForPay.billNumber} processed successfully via ${paymentMethod}!`);
        setIsPayModalOpen(false);
        fetchBills();
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    }
  };

  const openViewInvoice = (bill) => {
    setActiveInvoice(bill);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      header: 'Invoice #',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'monospace' }}>
          {row.billNumber}
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
      header: 'Appointment',
      render: (row) => <span>{row.appointmentNumber || 'OPD Walk-in'}</span>,
    },
    {
      header: 'Charges Breakdown',
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
          <div>Consult: ₹{row.consultationFee} | Tests: ₹{row.testCharges}</div>
          <div>Meds: ₹{row.medicineCharges} | Other: ₹{row.otherCharges}</div>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      render: (row) => (
        <div style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '1rem' }}>
          ₹{row.totalAmount}
        </div>
      ),
    },
    {
      header: 'Payment Status',
      render: (row) => <Badge status={row.paymentStatus} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => openViewInvoice(row)}
            className="btn btn-secondary btn-sm"
            title="View invoice receipt"
          >
            <Receipt size={14} />
            <span>Receipt</span>
          </button>

          {row.paymentStatus === 'PENDING' && (
            <button
              onClick={() => openPayModal(row)}
              className="btn btn-primary btn-sm"
              title="Collect payment"
            >
              <CreditCard size={14} />
              <span>Settle</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hospital Billing & Invoices</h1>
          <p>Generate patient invoices, calculate test and medicine charges, and settle payments</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--slate-500)" />
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Invoices</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button onClick={() => setIsGenerateModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Generate New Bill</span>
          </button>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Hospital Billing Ledger ({bills.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner text="Loading invoices..." />
          ) : (
            <DataTable
              columns={columns}
              data={bills}
              emptyMessage="No billing records found."
            />
          )}
        </div>
      </div>

      {/* Generate Bill Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Patient Invoice"
        maxWidth="650px"
      >
        <form onSubmit={handleGenerateBill}>
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
            <label className="form-label">Associated Appointment (Optional)</label>
            <select
              className="form-control"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            >
              <option value="">-- Direct OPD / No Appointment --</option>
              {appointments
                .filter((a) => !patientId || a.patientId === Number(patientId))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.appointmentNumber} - {a.patientName} with {a.doctorName} ({a.appointmentDate})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                className="form-control"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                min={0}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Diagnostic / Lab Tests (₹)</label>
              <input
                type="number"
                className="form-control"
                value={testCharges}
                onChange={(e) => setTestCharges(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pharmacy / Medicine Charges (₹)</label>
              <input
                type="number"
                className="form-control"
                value={medicineCharges}
                onChange={(e) => setMedicineCharges(e.target.value)}
                min={0}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Other Facility Charges (₹)</label>
              <input
                type="number"
                className="form-control"
                value={otherCharges}
                onChange={(e) => setOtherCharges(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hospital Discount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min={0}
            />
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary-200)',
            fontSize: '0.9rem',
            color: 'var(--primary-900)'
          }}>
            <strong>Server-side Calculation Notice:</strong> Total invoice will be validated and calculated by the backend as:
            <br />
            <code>(Consultation + Tests + Medicines + Other) - Discount = Total Amount</code>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsGenerateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Generating Invoice...' : 'Generate Bill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Process Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Process Payment: ${selectedBillForPay?.billNumber}`}
        maxWidth="500px"
      >
        <form onSubmit={handleProcessPayment}>
          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Amount Payable</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              ₹{selectedBillForPay?.totalAmount}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
              Patient: {selectedBillForPay?.patientName}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Payment Method *</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="CASH">Cash Payment</option>
              <option value="CARD">Debit / Credit Card</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="NET_BANKING">Net Banking / Insurance</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" onClick={() => setIsPayModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              <span>Confirm & Mark as Paid</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Receipt View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Official Hospital Invoice Receipt"
        maxWidth="600px"
      >
        {activeInvoice && (
          <div style={{ padding: '0.5rem' }}>
            <div style={{ borderBottom: '2px solid var(--slate-200)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-700)', fontSize: '1.35rem' }}>Smart Hospital Healthcare</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Official OPD & Clinical Invoice</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'monospace' }}>{activeInvoice.billNumber}</div>
                  <Badge status={activeInvoice.paymentStatus} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <strong>Patient:</strong> {activeInvoice.patientName} <br />
                <strong>Contact:</strong> {activeInvoice.patientPhone}
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Date:</strong> {new Date(activeInvoice.createdAt).toLocaleDateString()} <br />
                {activeInvoice.paymentMethod && <><strong>Method:</strong> {activeInvoice.paymentMethod}</>}
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--slate-200)', backgroundColor: 'var(--slate-50)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.5rem' }}>Doctor Consultation Fee</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{activeInvoice.consultationFee}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.5rem' }}>Diagnostic & Lab Tests</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{activeInvoice.testCharges}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.5rem' }}>Pharmacy & Medicines</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{activeInvoice.medicineCharges}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.5rem' }}>Facility / Other Services</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{activeInvoice.otherCharges}</td>
                </tr>
                {activeInvoice.discount > 0 && (
                  <tr style={{ borderBottom: '1px solid var(--slate-100)', color: 'var(--success-text)' }}>
                    <td style={{ padding: '0.5rem' }}>Hospital Discount Applied</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>-₹{activeInvoice.discount}</td>
                  </tr>
                )}
                <tr style={{ borderTop: '2px solid var(--slate-300)', fontWeight: 800, fontSize: '1.1rem' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>Total Amount</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--primary-800)' }}>
                    ₹{activeInvoice.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--slate-400)' }}>
              Thank you for trusting Smart Hospital Healthcare. Keep this receipt for reimbursement.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBilling;
