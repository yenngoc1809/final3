import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './RecommendedBooks.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function RecommendedBooks() {
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch(`${API_URL}api/books/randombooks`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecommendedBooks(data);
      } catch (err) {
        console.error('Failed to fetch recommended books:', err);
      }
    };

    fetchRecommendedBooks();
  }, []);

  // Tạo một danh sách dài hơn để lấp đầy không gian
  const repeatedBooks = recommendedBooks.concat(recommendedBooks);

  return (
    <div className='recommendedbooks-container'>
      <h1 className='recommendedbooks-title'>Recommended Books</h1>
      <div className='recommendedbooks'>
        <div className='images'>
          {repeatedBooks.map((book, index) => (
            <Link key={index} to={`/book/${book._id}`}> {/* Thêm Link xung quanh thẻ img */}
              <img className='recommended-book' src={book.coverImage} alt={book.bookName} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecommendedBooks;
