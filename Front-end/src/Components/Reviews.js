import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
//import './BookDetail.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

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
                await axios.post(`${API_URL}api/review/reviews`, newReview);
                setReviews([...reviews, { ...newReview, userId: { username: user.username }, createdAt: new Date() }]);
                setComment('');
            } catch (err) {
                console.error('Error adding review:', err);
            }
        }
    };

    return (
        <div className="reviews-section">
            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <p><strong>{review.userId.username}:</strong> {review.comment}</p>
                        <span>{new Date(review.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className="add-review">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                />
                <button onClick={handleAddReview}>Submit</button>
            </div>
        </div>
    );
}

export default Reviews;
