import React, { useState } from 'react';
import { UserOutlined, CheckSquareOutlined, SafetyOutlined, TeamOutlined, FileTextOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import SettlementList from './SettlementList';
import RecruitmentList from './RecruitmentList';
import TaxInvoiceList from './TaxInvoiceList';
import './Dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const MENU_BG = '#bdb300';
const MENU_BG_SELECTED = '#222';
const MENU_TEXT = '#fff';
const SIDEBAR_BG = '#fff200';

const Dashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [openSub, setOpenSub] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (key: string) => {
    setSelectedMenu(key);
    if (key === 'settlements') setOpenSub((v) => !v);
    else setOpenSub(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <div>대시보드 내용</div>;
      case 'dispatch':
        return <SettlementList />;
      case 'recruitment':
        return <RecruitmentList />;
      case 'taxinvoice':
        return <TaxInvoiceList />;
      default:
        return <div>대시보드 내용</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f4' }}>
      <Sidebar
        user={user}
        selectedMenu={selectedMenu}
        openSub={openSub}
        setOpenSub={setOpenSub}
        handleMenuClick={handleMenuClick}
        setSelectedMenu={setSelectedMenu}
        logout={() => { logout(); navigate('/login'); }}
      />
      <main className="custom-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; 