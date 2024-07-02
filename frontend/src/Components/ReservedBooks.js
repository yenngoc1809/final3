import React, { useEffect, useState } from 'react';
import './ReservedBooks.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function ReservedBooks() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}api/books/allbooks`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data); // Log dữ liệu để kiểm tra
                const outOfStockBooks = data.filter(book => book.bookCountAvailable === 0);
                setBooks(outOfStockBooks);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className='reservedbooks-container'>
            <h1 className='reservedbooks-title'>Temporary Out of Stock</h1>
            <table className='reservedbooks-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <tr key={index}>
                                <td>{book.bookName}</td>
                                <td>{book.author}</td>
                                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No books out of stock.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ReservedBooks;
