import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css'; // Import file CSS
import { AuthContext } from '../Context/AuthContext';
import { IconButton } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
const FALLBACK_IMAGE = process.env.REACT_APP_FALLBACK_IMAGE || 'path/to/fallback/image.jpg';

function Reviews({ bookId }) {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${API_URL}api/review/reviews/${bookId}`);
                setReviews(response.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchReviews();
    }, [bookId]);

    const handleAddReview = async () => {
        if (comment.trim()) {
            try {
                const newReview = { bookId, userId: user._id, comment };
                const response = await axios.post(`${API_URL}api/review/reviews`, newReview);
                setReviews([...reviews, { ...response.data, userId: { username: user.username }, createdAt: new Date() }]);
                setComment('');
            } catch (err) {
                console.error('Error adding review:', err);
            }
        }
    };

    return (
        <div className="reviews-section">
            <h2>Comments</h2>
            <div className="add-review">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                />
                <button onClick={handleAddReview}>Submit</button>
            </div>
            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <p><strong>{review.userId.username}:</strong> {review.comment}</p>
                        <span>{new Date(review.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requested, setRequested] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${API_URL}api/books/getbook/${id}`);
                setBook(response.data);
            } catch (err) {
                setError(`Error fetching book details: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        const checkRequest = async () => {
            if (user && user._id) {
                try {
                    const response = await axios.get(`${API_URL}api/books/request/check/${user._id}/${id}`);
                    if (response.data.exists) {
                        setRequested(true);
                        setRequestId(response.data.requestId);
                    }
                } catch (err) {
                    console.error('Error checking request:', err);
                }
            }
        };

        fetchBook();
        checkRequest();
    }, [id, user]);

    const handleRequest = async () => {
        if (!user || !user._id) {
            setError('User not logged in');
            return;
        }

        try {
            if (requested) {
                await axios.delete(`${API_URL}api/books/request/cancel/${requestId}`);
                setRequested(false);
                setRequestId(null);
                alert('Request canceled successfully!');
            } else {
                const response = await axios.post(`${API_URL}api/books/request`, { bookId: id, userId: user._id });
                setRequested(true);
                setRequestId(response.data.request._id);
                alert('Request sent successfully!');
            }
        } catch (err) {
            console.error('Error handling request:', err);
            setError(`Error handling request: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="book-detail-container">
            <div className="book-detail-top">
                <div className="book-detail-image">
                    <img
                        src={book.coverImage}
                        alt={book.bookName}
                        onError={(e) => e.target.src = FALLBACK_IMAGE}
                    />
                </div>
                <div className="book-detail-info">
                    <h1>{book.bookName}</h1>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Language:</strong> {book.language}</p>
                    <p className={book.bookCountAvailable > 0 ? 'available' : 'out-of-stock'}>
                        {book.bookCountAvailable > 0 ? `Available (${book.bookCountAvailable} copies)` : 'Out of stock'}
                    </p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Publication Date:</strong> {book.publicationDate}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <IconButton onClick={handleRequest}>
                        <LibraryBooksIcon /> {requested ? 'Cancel Request' : 'Request'}
                    </IconButton>
                    {error && <div className="error-message">Error: {error}</div>}
                </div>
            </div>
            <div className="reviews-section">
                <Reviews bookId={id} />
            </div>
        </div>
    );
}

export default BookDetail;
