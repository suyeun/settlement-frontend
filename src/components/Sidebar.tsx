import React from 'react';
import { UserOutlined, CheckSquareOutlined, SafetyOutlined, TeamOutlined, FileTextOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

interface SidebarProps {
  user: { name?: string; username?: string } | null;
  selectedMenu: string;
  openSub: boolean;
  setOpenSub: (v: boolean) => void;
  handleMenuClick: (key: string) => void;
  setSelectedMenu: (key: string) => void;
  logout: () => void;
}

const MENU_BG = '#bdb300';

const Sidebar: React.FC<SidebarProps> = ({
  user,
  selectedMenu,
  openSub,
  setOpenSub,
  handleMenuClick,
  setSelectedMenu,
  logout,
}) => {
  return (
    <aside className="custom-sidebar">
      {/* <div className="sidebar-logo">CATCH12</div> */}
      <img src="/catch12_logo_menu.png" alt="CATCH12" className="sidebar-logo-img" />
      <div className="sidebar-userbox">
        <Avatar size={56} icon={<UserOutlined />} style={{ background: '#fff', color: MENU_BG, marginBottom: 8 }} />
        <div className="sidebar-username">{user?.name || user?.username || '-'}</div>
        <div className="sidebar-userid">{user?.username || '-'}</div>
      </div>
      <nav className="sidebar-menu">
        <button className={`sidebar-menuitem${selectedMenu === 'dashboard' ? ' selected' : ''}`} onClick={() => handleMenuClick('dashboard')}>
          <DashboardOutlined className="sidebar-icon" /> 차트
        </button>
        <button className={`sidebar-menuitem${selectedMenu === 'settlements' || selectedMenu === 'dispatch' || selectedMenu === 'recruitment' ? ' selected' : ''}`} onClick={() => handleMenuClick('settlements')}>
          <CheckSquareOutlined className="sidebar-icon" /> 정산 내역
          <span className="sidebar-arrow">{openSub ? '▲' : '▼'}</span>
        </button>
        {openSub && (
          <div className="sidebar-submenu">
            <button className={`sidebar-menuitem sub${selectedMenu === 'dispatch' ? ' selected' : ''}`} onClick={() => setSelectedMenu('dispatch')}>
              <SafetyOutlined className="sidebar-icon" /> 파견
            </button>
            <button className={`sidebar-menuitem sub${selectedMenu === 'recruitment' ? ' selected' : ''}`} onClick={() => setSelectedMenu('recruitment')}>
              <TeamOutlined className="sidebar-icon" /> 채용대행
            </button>
          </div>
        )}
        <button className={`sidebar-menuitem${selectedMenu === 'taxinvoice' ? ' selected' : ''}`} onClick={() => handleMenuClick('taxinvoice')}>
          <FileTextOutlined className="sidebar-icon" /> 세금계산서
        </button>
      </nav>
      <button className="sidebar-logout" onClick={logout}>
        <LogoutOutlined className="sidebar-icon" /> 로그아웃
      </button>
    </aside>
  );
};

export default Sidebar; 