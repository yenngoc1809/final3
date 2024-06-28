import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../../../../Context/AuthContext';
import '../AdminDashboard.css';
import '../../MemberDashboard/MemberDashboard.css';

function Return() {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
    const { user } = useContext(AuthContext);

    const [allTransactions, setAllTransactions] = useState([]);
    const [executionStatus, setExecutionStatus] = useState(null); // For triggering the table data to be updated

    const [allMembersOptions, setAllMembersOptions] = useState([]);
    const [borrowerId, setBorrowerId] = useState(null);

    // Fetching all Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + 'api/users/allmembers');
                setAllMembersOptions(
                    response.data.map(member => ({
                        value: member._id,
                        text: member.userType === 'Student' ? `${member.userFullName}[${member.admissionId}]` : `${member.userFullName}[${member.employeeId}]`
                    }))
                );
            } catch (err) {
                console.log(err);
            }
        };
        getMembers();
    }, [API_URL]);

    // Getting all active transactions
    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const response = await axios.get(API_URL + 'api/transactions/all-transactions');
                setAllTransactions(
                    response.data.sort((a, b) => Date.parse(a.toDate) - Date.parse(b.toDate)).filter(data => data.transactionStatus === 'Active')
                );
                setExecutionStatus(null);
            } catch (err) {
                console.log(err);
            }
        };
        getAllTransactions();
    }, [API_URL, executionStatus]);

    const returnBook = async (transactionId, borrowerId, bookId, due) => {
        try {
            // Setting return date and transactionStatus to completed
            await axios.put(API_URL + 'api/transactions/update-transaction/' + transactionId, {
                isAdmin: user.isAdmin,
                transactionStatus: 'Completed',
                returnDate: moment(new Date()).format('MM/DD/YYYY')
            });

            // Getting borrower points already existed
            const borrowerData = await axios.get(API_URL + 'api/users/getuser/' + borrowerId);
            const points = borrowerData.data.points;

            // If the number of days after dueDate is greater than zero then decreasing points by 10 else increase by 10
            const newPoints = due > 0 ? points - 10 : points + 10;
            await axios.put(API_URL + 'api/users/updateuser/' + borrowerId, {
                points: newPoints,
                isAdmin: user.isAdmin
            });

            // Updating book count
            const bookDetails = await axios.get(API_URL + 'api/books/getbook/' + bookId);
            await axios.put(API_URL + 'api/books/updatebook/' + bookId, {
                isAdmin: user.isAdmin,
                bookCountAvailable: bookDetails.data.bookCountAvailable + 1
            });

            // Moving transaction to previous transactions
            await axios.put(API_URL + `api/users/${transactionId}/move-to-prevtransactions`, {
                userId: borrowerId,
                isAdmin: user.isAdmin
            });

            setExecutionStatus('Completed');
            alert('Book returned to the library successfully');
        } catch (err) {
            console.log(err);
        }
    };

    const convertToIssue = async transactionId => {
        try {
            await axios.put(API_URL + 'api/transactions/update-transaction/' + transactionId, {
                transactionType: 'Issued',
                isAdmin: user.isAdmin
            });
            setExecutionStatus('Completed');
            alert('Book issued successfully 🎆');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="semanticdropdown returnbook-dropdown">
                <Dropdown
                    placeholder="Select Member"
                    fluid
                    search
                    selection
                    value={borrowerId}
                    options={allMembersOptions}
                    onChange={(event, data) => setBorrowerId(data.value)}
                />
            </div>
            <p className="dashboard-option-title">Issued</p>
            <table className="admindashboard-table">
                <thead>
                    <tr>
                        <th>Book Name</th>
                        <th>Borrower Name</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Fine</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {allTransactions
                        ?.filter(data => {
                            if (borrowerId === null) {
                                return data.transactionType === 'Issued';
                            } else {
                                return data.borrowerId === borrowerId && data.transactionType === 'Issued';
                            }
                        })
                        .map((data, index) => (
                            <tr key={index}>
                                <td>{data.bookName}</td>
                                <td>{data.borrowerName}</td>
                                <td>{data.fromDate}</td>
                                <td>{data.toDate}</td>
                                <td>{Math.max(0, Math.floor((Date.parse(moment(new Date()).format('MM/DD/YYYY')) - Date.parse(data.toDate)) / 86400000) * 10)}</td>
                                <td>
                                    <button onClick={() => returnBook(data._id, data.borrowerId, data.bookId, Math.floor((Date.parse(moment(new Date()).format('MM/DD/YYYY')) - Date.parse(data.toDate)) / 86400000))}>Return</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <p className="dashboard-option-title">Reserved</p>
            <table className="admindashboard-table">
                <thead>
                    <tr>
                        <th>Book Name</th>
                        <th>Borrower Name</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {allTransactions
                        ?.filter(data => {
                            if (borrowerId === null) {
                                return data.transactionType === 'Reserved';
                            } else {
                                return data.borrowerId === borrowerId && data.transactionType === 'Reserved';
                            }
                        })
                        .map((data, index) => (
                            <tr key={index}>
                                <td>{data.bookName}</td>
                                <td>{data.borrowerName}</td>
                                <td>{data.fromDate}</td>
                                <td>{data.toDate}</td>
                                <td>
                                    <button onClick={() => convertToIssue(data._id)}>Convert</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Return;
