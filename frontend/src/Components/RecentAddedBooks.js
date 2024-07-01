import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './RecentAddedBooks.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function RecentAddedBooks() {
    const [recentBooks, setRecentBooks] = useState([]);

    useEffect(() => {
        const fetchRecentBooks = async () => {
            try {
                const response = await fetch(`${API_URL}api/books/recentbooks`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecentBooks(data);
            } catch (err) {
                console.error('Failed to fetch recent books:', err);
            }
        };

        fetchRecentBooks();
    }, []);

    // Tạo một danh sách dài hơn để lấp đầy không gian
    const repeatedBooks = recentBooks.concat(recentBooks);

    return (
        <div className='recentaddedbooks-container'>
            <h1 className='recentbooks-title'>Newest Books</h1>
            <div className='recentbooks'>
                <div className='images'>
                    {repeatedBooks.map((book, index) => (
                        <Link key={index} to={`/book/${book._id}`}> {/* Thêm Link xung quanh thẻ img */}
                            <img className='recent-book' src={book.coverImage} alt={book.bookName} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecentAddedBooks;
