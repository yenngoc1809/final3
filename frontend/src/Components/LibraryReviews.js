import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { AuthContext } from '../Context/AuthContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LibraryReviews.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function LibraryReviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const sliderRef = useRef(null);

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
            alert('Bạn phải đăng nhập để thêm bình luận.');
            return;
        }

        if (comment.trim()) {
            try {
                const newReview = { userId: user._id, comment };
                const response = await axios.post(`${API_URL}api/review/libraryreviews`, newReview);
                const addedReview = {
                    ...newReview,
                    userId: { username: user.username },
                    createdAt: new Date().toISOString() // Đảm bảo định dạng ngày giờ
                };
                setReviews([addedReview, ...reviews]); // Thêm bình luận mới vào đầu danh sách
                setComment('');
                sliderRef.current.slickGoTo(0); // Cuộn đến bình luận mới nhất
            } catch (err) {
                console.error('Error adding library review:', err);
            }
        }
    };

    const settings = {
        dots: reviews.length > 2, // Hiển thị dots nếu số lượng bình luận lớn hơn 5
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        appendDots: dots => {
            const totalDots = dots.length;
            const visibleDots = 5;
            const newDots = dots.slice(0, visibleDots);
            if (totalDots > visibleDots) {
                newDots.push(
                    <li key="more">
                        <button>...</button>
                    </li>
                );
            }
            return <ul>{newDots}</ul>;
        },
        customPaging: i => {
            const totalDots = reviews.length;
            const visibleDots = 5;
            if (totalDots > visibleDots && i >= visibleDots) {
                return <button>...</button>;
            }
            return <button>{i + 1}</button>;
        }
    };

    return (
        <div className="reviews-section">
            <Slider ref={sliderRef} {...settings}>
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <p><strong>{review.userId && review.userId.username ? review.userId.username : 'Anonymous'}:</strong> {review.comment}</p>
                        <span>{new Date(review.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </Slider>
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
