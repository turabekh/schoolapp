import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Drawer, Avatar } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { AuthContext } from 'src/authentication/AuthProvider';
import AppFooter from './AppFooter';

const { Header, Content } = Layout;

const PrivateLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useContext(AuthContext);
  let imageUrl = process.env.REACT_APP_BACKEND_URL + user?.profile_image
  const toggleDrawer = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = () => {
    setCollapsed(true); // Close the drawer when a menu item is clicked
  };


  return (
    <Layout>
      <Drawer
        open={!collapsed}
        onClose={toggleDrawer}
        placement="left"
        width={200}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: 'none' }}
      >
        <Link to="/" className="logo" style={{ display: "flex", justifyContent: "start", alignItems: "center", height: "44px" }}>CS 1500</Link>
        <Menu defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={handleMenuItemClick}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<HomeOutlined />} onClick={handleMenuItemClick}>
            <Link to="/">Topics</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<HomeOutlined />} onClick={handleMenuItemClick}>
            <Link to="/quizes">Quizes</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<HomeOutlined />} onClick={handleMenuItemClick}>
            <Link to="/gradebook">Gradebook</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<HomeOutlined />} onClick={handleMenuItemClick}>
            <Link to="/account">Account</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<UserOutlined />} onClick={handleMenuItemClick}>
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        </Menu>
        <div
          onClick={toggleDrawer}
          style={{
            position: 'absolute',
            top: 0,
            right: 16,
            fontSize: '30px',
            cursor: 'pointer',
          }}
        >
          &times;
        </div>
      </Drawer>
      <Layout>
        <Header
          style={{
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          <Link to="/" className="logo">CS 1500</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: "20px" }}>

            <Link to="/account">
              <Avatar src={imageUrl} size={32} icon={<UserOutlined />} />
            </Link>

            <MenuOutlined
              onClick={toggleDrawer}
              style={{ fontSize: '20px', cursor: 'pointer' }}
            />
          </div>
        </Header>
        <Content style={{ margin: '8px', minHeight: "90vh" }}>
          {children}
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default PrivateLayout;
