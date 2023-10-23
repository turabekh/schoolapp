import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      &copy; {new Date().getFullYear()} CS 1500
    </Footer>
  );
};

export default AppFooter;
