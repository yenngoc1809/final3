// components/UserRequests.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../../../Context/AuthContext";
import moment from 'moment';
//import './UserRequests.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function UserRequests({ adminView = false }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('Current user:', user);
        if (user && user._id) {
            if (adminView) {
                fetchAllRequests();
            } else {
                fetchUserRequests(user._id);
            }
        }
    }, [user, adminView]);

    const fetchUserRequests = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}api/books/requests/${userId}`);
            console.log('User requests:', response.data);
            setRequests(response.data);
        } catch (err) {
            console.error('Error fetching user requests:', err);
            setError(`Error fetching requests: ${err.response?.data?.message || err.message}`);
        }
    };

    const fetchAllRequests = async () => {
        try {
            const response = await axios.get(`${API_URL}api/books/request`);
            console.log('All requests:', response.data);
            setRequests(response.data);
        } catch (err) {
            console.error('Error fetching all requests:', err);
            setError(`Error fetching requests: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="user-requests">
            <h2>{adminView ? 'All User Requests' : 'My Requests'}</h2>
            {error && <div className="error-message">{error}</div>}
            <ul>
                {requests.map(request => (
                    <li key={request._id}>
                        <div className="request-item">
                            <h3>{request.book.bookName}</h3>
                            <p>Status: {request.status}</p>
                            <p>Requested at: {moment(request.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                            {adminView && <p>User: {request.user.username}</p>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserRequests;