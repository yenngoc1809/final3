import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Button, Confirm } from 'semantic-ui-react';
import moment from 'moment';
import '../AdminDashboard.css';
import '../../MemberDashboard/MemberDashboard.css';

function GetMember() {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

    const [allMembersOptions, setAllMembersOptions] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [memberDetails, setMemberDetails] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(`${API_URL}api/users/allmembers`);
                setAllMembersOptions(
                    response.data.map(member => ({
                        value: member._id,
                        text: member.userType === 'Student' ? `${member.userFullName}[${member.admissionId}]` : `${member.userFullName}[${member.employeeId}]`
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        };
        getMembers();
    }, [API_URL]);

    useEffect(() => {
        const getMemberDetails = async () => {
            if (memberId) {
                try {
                    const response = await axios.get(`${API_URL}api/users/getuser/${memberId}`);
                    setMemberDetails(response.data);
                } catch (err) {
                    console.error('Error in fetching the member details:', err);
                }
            }
        };
        getMemberDetails();
    }, [API_URL, memberId]);

    const deleteUser = async () => {
        try {
            await axios.delete(`${API_URL}api/users/deleteuser/${memberId}`, {
                data: { userId: memberId, isAdmin: true }
            });
            setAllMembersOptions(allMembersOptions.filter(member => member.value !== memberId));
            setMemberId(null);
            setMemberDetails(null);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    return (
        <div>
            <div className="semanticdropdown getmember-dropdown">
                <Dropdown
                    placeholder="Select Member"
                    fluid
                    search
                    selection
                    value={memberId}
                    options={allMembersOptions}
                    onChange={(event, data) => setMemberId(data.value)}
                />
            </div>
            {memberDetails && (
                <>
                    <div className="member-profile-content" id="profile@member">
                        <div className="user-details-topbar">
                            <img className="user-profileimage" src="./assets/images/Profile.png" alt="Profile" />
                            <div className="user-info">
                                <p className="user-name">{memberDetails.userFullName}</p>
                                <p className="user-id">{memberDetails.userType === 'Student' ? memberDetails.admissionId : memberDetails.employeeId}</p>
                                <p className="user-email">{memberDetails.email}</p>
                            </div>
                        </div>
                        <div className="user-details-specific">
                            <div className="specific-left">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ display: 'flex', flex: '0.5', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '18px' }}><b>DOB</b></span>
                                        <span style={{ fontSize: '16px' }}>{moment(memberDetails.dob).format('MM/DD/YYYY')}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="specific-right">
                                <div style={{ display: 'flex', flexDirection: 'column', flex: '0.5' }}>
                                    <p style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><b>Points</b></p>
                                    <p style={{ fontSize: '25px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>{memberDetails.points}</p>
                                </div>
                                <div className="dashboard-title-line"></div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: '0.5' }}>
                                    <p style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><b>Rank</b></p>
                                    <p style={{ fontSize: '25px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>{memberDetails.rank}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="member-activebooks-content" id="activebooks@member">
                        <p style={{ fontWeight: 'bold', fontSize: '22px', marginTop: '22px', marginBottom: '22px' }}>Issued</p>
                        <table className="activebooks-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Book-Name</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Fine</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberDetails.activeTransactions
                                    .filter(data => data.transactionType === 'Issued')
                                    .map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.bookName}</td>
                                            <td>{moment(data.fromDate).format('MM/DD/YYYY')}</td>
                                            <td>{moment(data.toDate).format('MM/DD/YYYY')}</td>
                                            <td>{Math.max(0, Math.floor((Date.parse(moment().format('MM/DD/YYYY')) - Date.parse(data.toDate)) / 86400000) * 10)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="member-reservedbooks-content" id="reservedbooks@member">
                        <p style={{ fontWeight: 'bold', fontSize: '22px', marginTop: '22px', marginBottom: '22px' }}>Reserved</p>
                        <table className="activebooks-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Book-Name</th>
                                    <th>From</th>
                                    <th>To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberDetails.activeTransactions
                                    .filter(data => data.transactionType === 'Reserved')
                                    .map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.bookName}</td>
                                            <td>{moment(data.fromDate).format('MM/DD/YYYY')}</td>
                                            <td>{moment(data.toDate).format('MM/DD/YYYY')}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="member-history-content" id="history@member">
                        <p style={{ fontWeight: 'bold', fontSize: '22px', marginTop: '22px', marginBottom: '22px' }}>History</p>
                        <table className="activebooks-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Book-Name</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberDetails.prevTransactions.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.bookName}</td>
                                        <td>{moment(data.fromDate).format('MM/DD/YYYY')}</td>
                                        <td>{moment(data.toDate).format('MM/DD/YYYY')}</td>
                                        <td>{moment(data.returnDate).format('MM/DD/YYYY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="delete-member">
                        <Button negative onClick={() => setConfirmOpen(true)}>Delete Member</Button>
                        <Confirm
                            open={confirmOpen}
                            onCancel={() => setConfirmOpen(false)}
                            onConfirm={() => {
                                deleteUser();
                                setConfirmOpen(false);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default GetMember;
