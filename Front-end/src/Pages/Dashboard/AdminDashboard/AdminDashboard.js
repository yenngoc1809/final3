// AdminDashboard.js

import React, { useState } from 'react';
import "./AdminDashboard.css";
import AddTransaction from './Components/AddTransaction';
import AddBook from './Components/AddBook';
import GetMember from './Components/GetMember';
import Return from './Components/Return';
import UserProfile from './Components/UserProfile';
import AddCategory from './Components/AddCategory';
import RequestList from './Components/RequestList'; // Import RequestList

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BookIcon from '@material-ui/icons/Book';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import CategoryIcon from '@material-ui/icons/Category';

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

function AdminDashboard() {
    const [active, setActive] = useState("profile");
    const [sidebar, setSidebar] = useState(false);

    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <div className="dashboard">
            <div className="dashboard-card">
                <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
                    <IconButton>
                        {sidebar ? <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} /> : <DoubleArrowIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />}
                    </IconButton>
                </div>

                <div className={sidebar ? "dashboard-options active" : "dashboard-options"}>
                    <div className='dashboard-logo'>
                        <LibraryBooksIcon style={{ fontSize: 50 }} />
                        <p className="logo-name">LCMS</p>
                    </div>
                    <p className={`dashboard-option ${active === "profile" ? "clicked" : ""}`} onClick={() => { setActive("profile"); setSidebar(false); }}><AccountCircleIcon className='dashboard-option-icon' /> Profile</p>
                    <p className={`dashboard-option ${active === "addbook" ? "clicked" : ""}`} onClick={() => { setActive("addbook"); setSidebar(false); }}><BookIcon className='dashboard-option-icon' /> Add Book</p>
                    <p className={`dashboard-option ${active === "addtransaction" ? "clicked" : ""}`} onClick={() => { setActive("addtransaction"); setSidebar(false); }}><ReceiptIcon className='dashboard-option-icon' /> Add Transaction </p>
                    <p className={`dashboard-option ${active === "getmember" ? "clicked" : ""}`} onClick={() => { setActive("getmember"); setSidebar(false); }}><AccountBoxIcon className='dashboard-option-icon' /> Get Member </p>
                    <p className={`dashboard-option ${active === "returntransaction" ? "clicked" : ""}`} onClick={() => { setActive("returntransaction"); setSidebar(false); }}><AssignmentReturnIcon className='dashboard-option-icon' /> Return </p>
                    <p className={`dashboard-option ${active === "addcategory" ? "clicked" : ""}`} onClick={() => { setActive("addcategory"); setSidebar(false); }}><CategoryIcon className='dashboard-option-icon' /> Add Category</p>
                    <p className={`dashboard-option`} onClick={logout}><PowerSettingsNewIcon className='dashboard-option-icon' /> Log out </p>
                </div>

                <div className="dashboard-option-content">
                    <div className="dashboard-profile-content" style={active !== "profile" ? { display: 'none' } : {}}>
                        <UserProfile />
                    </div>
                    <div className="dashboard-addbooks-content" style={active !== "addbook" ? { display: 'none' } : {}}>
                        <AddBook />
                    </div>
                    <div className="dashboard-transactions-content" style={active !== "addtransaction" ? { display: 'none' } : {}}>
                        <AddTransaction />
                    </div>
                    <div className="dashboard-getmember-content" style={active !== "getmember" ? { display: 'none' } : {}}>
                        <GetMember />
                    </div>
                    <div className="dashboard-returntransaction-content" style={active !== "returntransaction" ? { display: 'none' } : {}}>
                        <Return />
                    </div>
                    <div className="dashboard-addcategory-content" style={active !== "addcategory" ? { display: 'none' } : {}}>
                        <AddCategory />
                    </div>
                    <div className="dashboard-requestlist-content" style={active !== "requestlist" ? { display: 'none' } : {}}>
                        <RequestList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
