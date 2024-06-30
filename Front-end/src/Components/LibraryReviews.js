import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function LibraryReviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${API_URL}api/review/library-reviews`);
                setReviews(response.data);
            } catch (err) {
                console.error('Error fetching library reviews:', err);
            }
        };

        fetchReviews();
    }, []);

    const handleAddReview = async () => {
        if (!user || !user._id) {
            console.error('User not authenticated');
            return;
        }

        if (comment.trim()) {
            try {
                const newReview = { userId: user._id, comment };
                const response = await axios.post(`${API_URL}api/review/libraryreviews`, newReview);
                setReviews([...reviews, { ...newReview, userId: { username: user.username }, createdAt: new Date() }]);
                setComment('');
            } catch (err) {
                console.error('Error adding library review:', err);
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

export default LibraryReviews;
