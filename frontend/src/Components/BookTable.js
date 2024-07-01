import React, { useState, useContext, useEffect } from 'react';
import './BookTable.css';
import { IconButton } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
const FALLBACK_IMAGE = process.env.REACT_APP_FALLBACK_IMAGE || 'path/to/fallback/image.jpg';

function BookTable({ books }) {
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      if (user && user._id) {
        const requestsStatus = {};
        for (const book of books) {
          try {
            const response = await axios.get(`${API_URL}api/books/request/check/${user._id}/${book._id}`);
            requestsStatus[book._id] = response.data.exists ? response.data.requestId : null;
          } catch (err) {
            console.error('Error checking request:', err);
          }
        }
        setRequests(requestsStatus);
      }
    };

    fetchRequests();
  }, [user, books]);

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  const handleRequest = async (bookId) => {
    if (!user || !user._id) {
      setError('User not logged in');
      return;
    }

    try {
      if (requests[bookId]) {
        await axios.delete(`${API_URL}api/books/request/cancel/${requests[bookId]}`);
        setRequests(prevRequests => ({ ...prevRequests, [bookId]: null }));
        alert('Request canceled successfully!');
      } else {
        const response = await axios.post(`${API_URL}api/books/request`, { bookId, userId: user._id });
        setRequests(prevRequests => ({ ...prevRequests, [bookId]: response.data.request._id }));
        alert('Request sent successfully!');
      }
    } catch (err) {
      console.error('Error handling request:', err);
      setError(`Error handling request: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="book-grid">
      {books.map(book => (
        <div key={book._id} className={`book-item ${book.bookCountAvailable > 0 ? 'available' : 'unavailable'}`}>
          <Link to={`/book/${book._id}`}>
            <img
              src={book.coverImage || FALLBACK_IMAGE} // Sử dụng ảnh dự phòng nếu không có ảnh bìa
              alt={book.bookName || 'No title'} // Hiển thị thông báo nếu không có tên sách
              onError={handleImageError}
              className="book-cover"
            />
          </Link>
          <div className="book-info">
            <h5>{book.bookName || 'No title'}</h5> {/* Hiển thị thông báo nếu không có tên sách */}
            <p>{book.author || 'Unknown author'}</p> {/* Hiển thị thông báo nếu không có tác giả */}
            <p>{book.language || 'Unknown language'}</p> {/* Hiển thị thông báo nếu không có ngôn ngữ */}
            <p>{book.bookCountAvailable > 0 ? `Available (${book.bookCountAvailable} copies)` : 'Out of stock'}</p>
            <IconButton onClick={() => handleRequest(book._id)}>
              <LibraryBooksIcon /> {requests[book._id] ? 'Cancel Request' : 'Request'}
            </IconButton>
          </div>
        </div>
      ))}
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default BookTable;
