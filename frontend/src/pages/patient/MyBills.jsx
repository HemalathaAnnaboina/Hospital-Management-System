import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { CreditCard, Receipt, FileText } from 'lucide-react';

const MyBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getBills();
      if (res.success) setBills(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = (bill) => {
    setActiveInvoice(bill);
    setIsModalOpen(true);
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
      header: 'Appointment',
      render: (row) => <span>{row.appointmentNumber || 'Direct OPD'}</span>,
    },
    {
      header: 'Billing Date',
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: 'Charges Breakdown',
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
          <div>Consult: ₹{row.consultationFee} | Tests: ₹{row.testCharges}</div>
          <div>Meds: ₹{row.medicineCharges}</div>
        </div>
      ),
    },
    {
      header: 'Total Payable',
      render: (row) => (
        <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>
          ₹{row.totalAmount}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.paymentStatus} />,
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => handleOpenReceipt(row)}
          className="btn btn-secondary btn-sm"
        >
          <Receipt size={14} />
          <span>View Receipt</span>
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text="Retrieving bills and invoices..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Medical Bills & Invoices</h1>
          <p>Review consultation fees, lab diagnostic tests, medication charges, and payment statuses</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="card">
        <div className="card-header">
          <h2>Invoices Ledger ({bills.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={bills}
            emptyMessage="You have no bills or invoices issued yet."
          />
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Official Patient Billing Receipt"
        maxWidth="600px"
      >
        {activeInvoice && (
          <div style={{ padding: '0.5rem' }}>
            <div style={{ borderBottom: '2px solid var(--slate-200)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-700)', fontSize: '1.35rem' }}>Smart Hospital Healthcare</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Clinical OPD Invoice</div>
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
                <strong>Phone:</strong> {activeInvoice.patientPhone}
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
                    <td style={{ padding: '0.5rem' }}>Discount</td>
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
              {activeInvoice.paymentStatus === 'PAID'
                ? 'Paid in full. Thank you for choosing Smart Hospital.'
                : 'Payment pending. Please settle at front desk or OPD billing counter.'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBills;
