import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaChartBar, FaSignOutAlt, FaUserShield, FaEnvelope, FaRobot, FaSitemap } from 'react-icons/fa';
import '../../styles/sidebar.css';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';

const SidebarAdmin = () => {
  const { logout } = useAuth();
    const { t } = useTranslation();


  return (
    <div className="sidebar-container">
      <hr className="sidebar-divider" />

      <nav className="flex flex-column sidebar-submenu">
        <div className="sidebar-toggle">
          <FaUserShield className="mr-3 text-lg" />
          <span className="sidebar-toggle-text">Admin</span>
        </div>
        <hr className="sidebar-divider" />


        <NavLink
          to="/admin/dashboard"
          className="sidebar-link"
        >
          <FaChartBar className="mr-3 text-lg" />
          <span>{t('dashboard')}</span>
        </NavLink>
        <NavLink
          to="/users"
          className="sidebar-link"
        >
          <FaUsers className="mr-3 text-lg" />
          <span>{t('users')}</span>
        </NavLink>

        <NavLink to="/admin/user-oversight" className="sidebar-link">
          <FaSitemap className="mr-3 text-lg" />
          <span>{t('user_oversight')}</span>
        </NavLink>

        <NavLink
          to="/admin/email-history"
          className="sidebar-link"
        >
          <FaEnvelope className="mr-3 text-lg" />
          <span>{t('email_history')}</span>
        </NavLink>

        <NavLink
          to="/admin/ai-model"
          className="sidebar-link"
        >
          <FaRobot className="mr-3 text-lg" />
          <span>{t('ai_model')}</span>
        </NavLink>
        <hr />


        {/* Logout Button */}
        <button onClick={logout} className="sidebar-link">
          <FaSignOutAlt className="mr-3 text-lg" />
          <span className="text-md">{t('logout')}</span>
        </button>
      </nav>

    </div>
  );
};

export default SidebarAdmin;
