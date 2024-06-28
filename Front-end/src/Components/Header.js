import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

function Header() {
    const [menutoggle, setMenutoggle] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true); // Phải được đặt dựa trên trạng thái người dùng
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
    const [searchQuery, setSearchQuery] = useState(''); // Trạng thái cho đầu vào tìm kiếm
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ localStorage hoặc bất kỳ phương thức nào bạn đang sử dụng
        const loggedIn = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedIn === 'true');
    }, []);

    const Toggle = () => {
        setMenutoggle(!menutoggle);
    };

    const closeMenu = () => {
        setMenutoggle(false);
    };

    const handleMenuClick = () => {
        closeMenu();
        if (isLoggedIn) {
            navigate(isAdmin ? '/dashboard@admin' : '/dashboard@member'); // Chuyển hướng đến trang dashboard
        } else {
            navigate('/signin'); // Chuyển hướng đến trang signin
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <div className="header">
            <div className="logo-nav">
                <Link to='/'>
                    <span>LIBRARY</span>
                </Link>
            </div>
            <div className='nav-right'>
                {!isLoggedIn && (
                    <>
                        <input
                            className='search-input'
                            type='text'
                            placeholder='Search a Book'
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleSearch}
                        />
                    </>
                )}
                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={closeMenu}>
                        <Link to='/'>Home</Link>
                    </li>
                    <li className="option" onClick={closeMenu}>
                        <Link to='/allbooks'>Books</Link>
                    </li>
                    <li className="option" onClick={handleMenuClick}>
                        <span>{isLoggedIn ? 'Menu' : 'Sign In'}</span>
                    </li>
                </ul>
            </div>
            <div className="mobile-menu" onClick={Toggle}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>
        </div>
    );
}

export default Header;
