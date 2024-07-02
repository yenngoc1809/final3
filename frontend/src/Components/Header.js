import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Đảm bảo rằng đường dẫn đúng
import './Header.css';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

function Header() {
    const [menutoggle, setMenutoggle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const Toggle = () => {
        setMenutoggle(!menutoggle);
    };

    const closeMenu = () => {
        setMenutoggle(false);
    };

    const handleMenuClick = () => {
        closeMenu();
        if (user) {
            navigate(user.isAdmin ? '/dashboard@admin' : '/dashboard@member'); // Chuyển hướng đến trang dashboard
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
                <input
                    className='search-input'
                    type='text'
                    placeholder='Search a Book'
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearch}
                />
                <ul className={menutoggle ? "nav-options nav-options-active" : "nav-options"}>
                    <li className="option" onClick={closeMenu}>
                        <Link to='/'>Home</Link>
                    </li>
                    <li className="option" onClick={closeMenu}>
                        <Link to='/allbooks'>Books</Link>
                    </li>
                    <li className="option" onClick={handleMenuClick}>
                        <span>{user ? 'Dashboard' : 'Sign In'}</span>
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
