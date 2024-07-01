import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../../../Context/AuthContext";
import './RequestList.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function RequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${API_URL}api/books/requests`);
                setRequests(response.data);
            } catch (err) {
                setError(`Error fetching requests: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await axios.post(`${API_URL}api/books/request/accept/${requestId}`, { isAdmin: true });
            alert(response.data.message);
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (err) {
            console.error('Error accepting request:', err);
            setError(`Error accepting request: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            const response = await axios.delete(`${API_URL}api/books/request/cancel/${requestId}`, { data: { isAdmin: true } });
            alert(response.data.message);
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (err) {
            console.error('Error deleting request:', err);
            setError(`Error deleting request: ${err.response?.data?.message || err.message}`);
        }
    };

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (user?.role !== 'admin') {
        return <div>Access denied. Only admins can view this page.</div>;
    }

    return (
        <div className="request-list">
            <h1>Request List</h1>
            <ul>
                {requests.map(request => (
                    <li key={request._id}>
                        <div className="request-item">
                            <span>{request.book.bookName} - {request.userId.userFullName} - {request.status}</span>
                            <button
                                onClick={() => handleAcceptRequest(request._id)}
                                disabled={request.book.bookCountAvailable <= 0}
                            >
                                Accept
                            </button>
                            <button onClick={() => handleDeleteRequest(request._id)}>Delete</button>
                            {request.book.bookCountAvailable <= 0 && <span>Not available now</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RequestList;
