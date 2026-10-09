import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Users,
  UserPlus,
  Calendar,
  Layers,
  FileText,
  CreditCard,
  LogOut,
  Clock,
  Search,
  Stethoscope,
  FolderHeart,
  Pill,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user, role, logout } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
          { to: '/admin/patients', label: 'Patients', icon: Users },
          { to: '/admin/departments', label: 'Departments', icon: Layers },
          { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
        ];
      case 'DOCTOR':
        return [
          { to: '/doctor/dashboard', label: 'Overview', icon: Activity },
          { to: '/doctor/appointments', label: 'My Appointments', icon: Calendar },
        ];
      case 'RECEPTIONIST':
        return [
          { to: '/receptionist/dashboard', label: 'Front Desk', icon: Activity },
          { to: '/receptionist/register-patient', label: 'Register Patient', icon: UserPlus },
          { to: '/receptionist/search-patients', label: 'Search Patients', icon: Search },
          { to: '/receptionist/book-appointment', label: 'Book Appointment', icon: Calendar },
          { to: '/receptionist/billing', label: 'Billing & Invoices', icon: CreditCard },
        ];
      case 'PATIENT':
        return [
          { to: '/patient/dashboard', label: 'Dashboard', icon: Activity },
          { to: '/patient/book-appointment', label: 'Book Appointment', icon: Calendar },
          { to: '/patient/my-appointments', label: 'My Bookings', icon: Clock },
          { to: '/patient/my-records', label: 'Medical Records', icon: FolderHeart },
          { to: '/patient/my-prescriptions', label: 'Prescriptions', icon: Pill },
          { to: '/patient/my-bills', label: 'Bills & Invoices', icon: CreditCard },
          { to: '/patient/profile', label: 'Profile', icon: UserCheck },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <div>
          <div className="brand-title">SmartHospital</div>
          <div className="brand-subtitle">{role || 'System'} Portal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="avatar-circle">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info-text">
            <div className="user-name-text">{user?.fullName || 'User'}</div>
            <span className="user-role-badge">{role}</span>
          </div>
        </div>
        <button onClick={logout} className="btn-logout" title="Sign out of system">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
