import React from "react";
import { AppstoreOutlined, MailOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import { useAuth } from '../useAuth'; // Import the custom hook

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/');
    };

    const publicItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to='/'>Home</Link>,
        },
        {
            key: 'Login',
            icon: <MailOutlined />,
            label: <Link to='/login'>Login</Link>,
        },
        {
            key: 'SignUp',
            icon: <AppstoreOutlined />,
            label: <Link to='/signup'>Sign Up</Link>,
        },
    ];

    const privateItems = [
        {
            key: 'userhome',
            icon: <HomeOutlined />,
            label: <Link to='/userhome'>User Home</Link>,
        },
        {
            key: 'app',
            icon: <AppstoreOutlined />,
            label: <Link to='/tables'>Table</Link>,
        },

        {
          key: 'app',
          icon: <AppstoreOutlined />,
          label: <Link to='/CustomTable'>CustomTable</Link>,
      },
    ];

    const menuItems = isLoggedIn ? privateItems : publicItems;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Menu mode="horizontal" items={menuItems} style={{ flex: 1 }} />
            {isLoggedIn && (
                <Menu mode="horizontal" selectable={false}>
                    <Menu.SubMenu key="SubMenu" title="MI" icon={<UserOutlined />}>
                        <Menu.Item key="setting:1">Settings</Menu.Item>
                        <Menu.Item key="setting:2" onClick={handleLogout}>Logout</Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            )}
        </div>
    );
};

export default NavBar;
