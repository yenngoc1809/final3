import React from 'react';
import './BookTable.css';

function BookTable({ books }) {
  const handleImageError = (e) => {
    e.target.src = 'path/to/fallback/image.jpg'; // Thay thế bằng đường dẫn đến hình ảnh dự phòng của bạn
  };

  console.log('Books in BookTable:', books); // Log dữ liệu nhận được

  return (
    <div className="book-grid">
      {books.map(book => (
        <div key={book._id} className={`book-item ${book.bookCountAvailable > 0 ? 'available' : 'unavailable'}`}>
          <img
            src={book.coverImage}
            alt={book.bookName}
            onError={handleImageError}
            className="book-cover"
          />
          <div className="book-info">
            <h5>{book.bookName}</h5>
            <p>{book.author}</p>
            <p>{book.language}</p>
            <p>{book.bookCountAvailable > 0 ? `Available (${book.bookCountAvailable} copies)` : 'Out of stock'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookTable;
