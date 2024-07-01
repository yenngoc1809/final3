import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

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
        if (!user || !user._id) {
            console.error('User not authenticated');
            alert('You must be logged in to add a review');
            return;
        }

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
                        <p>
                            <strong>
                                {review.userId && review.userId.username ? review.userId.username : 'Anonymous'}
                                :</strong> {review.comment}
                        </p>
                        <span>{new Date(review.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            {user && user._id ? (
                <div className="add-review">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                    />
                    <button onClick={handleAddReview}>Submit</button>
                </div>
            ) : (
                <p>Please log in to add a review.</p>
            )}
        </div>
    );
}

export default Reviews;
