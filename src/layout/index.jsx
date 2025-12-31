import React, { useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import useUserStore from '../store/userStore';
import loginApi from '../api/login';
import './index.css';

const { Header, Content } = Layout;

const LayoutComponent = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userInfo,
    messageCount,
    initUserInfo,
    getUserMessageInfo,
    clearLogin
  } = useUserStore();

  useEffect(() => {
    initUserInfo();
    getUserMessageInfo();
  }, [initUserInfo, getUserMessageInfo]);

  const handleLogout = async () => {
    try {
      const result = await loginApi.logout();
      if (result && result.code === 1) {
        clearLogin();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { key: '/index', label: '首页' },
    { key: '/paper/index', label: '试卷中心' },
    { key: '/record/index', label: '考试记录' },
    { key: '/question/index', label: '错题本' },
  ];

  const dropdownItems = [
    <Menu.Item key="1" onClick={() => navigate('/user/index')}>
      个人中心
    </Menu.Item>,
    <Menu.Item key="2" onClick={() => navigate('/user/message')}>
      <Badge count={messageCount} showZero>
        消息中心
      </Badge>
    </Menu.Item>,
    <Menu.Divider />,
    <Menu.Item key="3" onClick={handleLogout}>
      <LogoutOutlined /> 退出
    </Menu.Item>,
  ];

  return (
    <Layout className="student-layout">
      <Header className="student-header">
        <div className="head-user">
          <Dropdown menu={{ items: dropdownItems }} placement="bottom">
            <Badge dot={messageCount > 0}>
              <Avatar
                src={userInfo?.imagePath}
                size="medium"
                icon={<UserOutlined />}
                className="el-dropdown-avatar"
              />
            </Badge>
          </Dropdown>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          className="el-menu-title"
        />
        <div>
          <a href="/"><img src="https://via.placeholder.com/120x56?text=Logo" height="56" alt="Logo" /></a>
        </div>
      </Header>
      <Content className="student-main">
        {children}
      </Content>
      <div className="foot-copyright">
        <span>
          <a href="https://github.com/SakurakoujiHakuya" target="_blank" rel="noopener noreferrer">
            GitHub: SakurakoujiHakuya
          </a>
        </span>
        <span> | </span>
        <span>
          <a href="mailto:2366158084@qq.com">
            2366158084@qq.com
          </a>
        </span>
      </div>
    </Layout>
  );
};

export default LayoutComponent;