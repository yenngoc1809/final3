import React, { useContext, useEffect, useState } from 'react';
import "../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from '../../../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function AddTransaction() {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const [borrowerId, setBorrowerId] = useState("");
    const [borrowerDetails, setBorrowerDetails] = useState({});
    const [bookId, setBookId] = useState("");
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [allBooks, setAllBooks] = useState([]);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const transactionTypes = [
        { value: 'Reserved', text: 'Reserve' },
        { value: 'Issued', text: 'Issue' }
    ];

    const [transactionType, setTransactionType] = useState("");

    useEffect(() => {
        const getAllMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers");
                const all_members = response.data.map(member => (
                    { value: member._id, text: member.userType === "Student" ? `${member.userFullName}[${member.admissionId}]` : `${member.userFullName}[${member.employeeId}]` }
                ));
                setAllMembers(all_members);
            } catch (err) {
                console.error("Failed to fetch members. Please try again.");
            }
        };
        getAllMembers();
    }, [API_URL]);

    useEffect(() => {
        const getAllBooks = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/allbooks");
                const all_books = response.data.map(book => (
                    { value: book._id, text: book.bookName }
                ));
                setAllBooks(all_books);
            } catch (err) {
                console.error("Failed to fetch books. Please try again.");
            }
        };
        getAllBooks();
    }, [API_URL]);

    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const response = await axios.get(API_URL + "api/transactions/all-transactions");
                setRecentTransactions(response.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to fetch transactions. Please try again.");
            }
        };
        getAllTransactions();
    }, [API_URL]);

    const addTransaction = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (bookId && borrowerId && transactionType && fromDate && toDate) {
            try {
                const borrowerDetailsResponse = await axios.get(`${API_URL}api/users/getuser/${borrowerId}`);
                const bookDetailsResponse = await axios.get(`${API_URL}api/books/getbook/${bookId}`);

                const borrower_details = borrowerDetailsResponse.data;
                const book_details = bookDetailsResponse.data;

                if ((book_details.bookCountAvailable > 0 && (transactionType === "Issued" || transactionType === "Reserved")) || (book_details.bookCountAvailable === 0 && transactionType === "Reserved")) {
                    const transactionData = {
                        bookId,
                        borrowerId,
                        borrowerName: borrower_details.userFullName,
                        bookName: book_details.bookName,
                        transactionType,
                        fromDate: moment(fromDate).format("MM/DD/YYYY"),
                        toDate: moment(toDate).format("MM/DD/YYYY"),
                        isAdmin: user.isAdmin
                    };

                    const response = await axios.post(`${API_URL}api/transactions/add-transaction`, transactionData);

                    await axios.put(`${API_URL}api/books/updatebook/${bookId}`, {
                        isAdmin: user.isAdmin,
                        bookCountAvailable: book_details.bookCountAvailable - 1
                    });

                    setRecentTransactions(prevTransactions => [response.data, ...prevTransactions.slice(0, 4)]);
                    resetForm();
                    alert("Transaction was successful 🎉");
                } else {
                    alert("The book is not available");
                }
            } catch (err) {
                console.error("Error in adding transaction:", err);
                alert("Failed to add transaction. Please try again.");
            }
        } else {
            alert("All fields must be filled");
        }

        setIsLoading(false);
    };

    const resetForm = () => {
        setBorrowerId("");
        setBookId("");
        setTransactionType("");
        setFromDate(null);
        setToDate(null);
        setEditingTransaction(null);
    };

    const loadTransactionForEditing = (transaction) => {
        setEditingTransaction(transaction._id);
        setBorrowerId(transaction.borrowerId);
        setBookId(transaction.bookId);
        setTransactionType(transaction.transactionType);

        const fromDate = transaction.fromDate ? new Date(transaction.fromDate) : null;
        const toDate = transaction.toDate ? new Date(transaction.toDate) : null;

        setFromDate(fromDate);
        setToDate(toDate);
    };

    const updateTransaction = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (editingTransaction && bookId && borrowerId && transactionType && fromDate && toDate) {
            try {
                const transactionData = {
                    bookId,
                    borrowerId,
                    transactionType,
                    fromDate: moment(fromDate).format("MM/DD/YYYY"),
                    toDate: moment(toDate).format("MM/DD/YYYY"),
                    isAdmin: user.isAdmin
                };

                const response = await axios.put(`${API_URL}api/transactions/update-transaction/${editingTransaction}`, transactionData);

                setRecentTransactions(prevTransactions =>
                    prevTransactions.map(trans => trans._id === editingTransaction ? response.data : trans)
                );
                resetForm();
                alert("Transaction Updated Successfully 🎉");
            } catch (err) {
                console.error("Error updating transaction:", err);
                alert("Failed to update transaction. Please try again.");
            }
        } else {
            alert("All fields must be filled");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (borrowerId) {
            const fetchBorrowerDetails = async () => {
                try {
                    const response = await axios.get(`${API_URL}api/users/getuser/${borrowerId}`);
                    setBorrowerDetails(response.data);
                } catch (err) {
                    console.error("Failed to fetch borrower details:", err);
                }
            };
            fetchBorrowerDetails();
        } else {
            setBorrowerDetails({});
        }
    }, [API_URL, borrowerId]);

    return (
        <div>
            <p className="dashboard-option-title">{editingTransaction ? "Update" : "Add"} a Transaction</p>
            <div className="dashboard-title-line"></div>
            <form className='transaction-form' onSubmit={editingTransaction ? updateTransaction : addTransaction}>
                <label className="transaction-form-label" htmlFor="borrowerId">Borrower<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Member'
                        fluid
                        search
                        selection
                        value={borrowerId}
                        options={allMembers}
                        onChange={(event, data) => setBorrowerId(data.value)}
                    />
                </div>
                {borrowerId && (
                    <>
                        <table className="admindashboard-table shortinfo-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Issued</th>
                                    <th>Reserved</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{borrowerDetails.userFullName}</td>
                                    <td>{borrowerDetails.activeTransactions?.filter(data => data.transactionType === "Issued" && data.transactionStatus === "Active").length}</td>
                                    <td>{borrowerDetails.activeTransactions?.filter(data => data.transactionType === "Reserved" && data.transactionStatus === "Active").length}</td>
                                    <td>{borrowerDetails.points}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="admindashboard-table shortinfo-table">
                            <thead>
                                <tr>
                                    <th>Book-Name</th>
                                    <th>Transaction</th>
                                    <th>From Date<br /><span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span></th>
                                    <th>To Date<br /><span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span></th>
                                    <th>Fine</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowerDetails.activeTransactions?.filter(data => data.transactionStatus === "Active").map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.bookName}</td>
                                        <td>{data.transactionType}</td>
                                        <td>{moment(data.fromDate).format('L')}</td>
                                        <td>{moment(data.toDate).format('L')}</td>
                                        <td>{(Math.floor((Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate)) / 86400000)) <= 0 ? 0 : (Math.floor((Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate)) / 86400000)) * 10}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                <label className="transaction-form-label" htmlFor="bookId">Book<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Book'
                        fluid
                        search
                        selection
                        value={bookId}
                        options={allBooks}
                        onChange={(event, data) => setBookId(data.value)}
                    />
                </div>
                <label className="transaction-form-label" htmlFor="transactionType">Transaction Type<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Type'
                        fluid
                        search
                        selection
                        value={transactionType}
                        options={transactionTypes}
                        onChange={(event, data) => setTransactionType(data.value)}
                    />
                </div>
                <label className="transaction-form-label" htmlFor="fromDate">From<span className="required-field">*</span></label><br />
                <DatePicker
                    className="datepicker"
                    selected={fromDate}
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date) => setFromDate(date)}
                />
                <br />
                <label className="transaction-form-label" htmlFor="toDate">To<span className="required-field">*</span></label><br />
                <DatePicker
                    className="datepicker"
                    selected={toDate}
                    minDate={fromDate}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date) => setToDate(date)}
                />

                <button className="addbook-submit" type="" disabled={isLoading}>{editingTransaction ? "Update" : "Submit"}</button>
            </form>
            <div>
                <p className="dashboard-option-title">Recent Transactions</p>
                <div className="dashboard-title-line"></div>
                <table className="admindashboard-table transaction-table">
                    <thead>
                        <tr>
                            <th>Transaction</th>
                            <th>Book Name</th>
                            <th>Borrower</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((data, index) => (
                            <tr key={index}>
                                <td>{data.transactionType}</td>
                                <td>{data.bookName}</td>
                                <td>{data.borrowerName}</td>
                                <td>{moment(data.fromDate).format('L')}</td>
                                <td>{moment(data.toDate).format('L')}</td>
                                <td>
                                    <button onClick={() => loadTransactionForEditing(data)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddTransaction;
