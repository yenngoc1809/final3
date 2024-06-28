import React, { useEffect, useState } from 'react';
import './Allbooks.css';
import BookTable from '../Components/BookTable.js'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function Allbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}api/books/allbooks`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <BookTable books={books} />
    </div>
  );
}

export default Allbooks;
