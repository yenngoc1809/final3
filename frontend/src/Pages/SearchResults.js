import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookTable from '../Components/BookTable';
import '../Components/BookTable.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const query = useQuery().get('query');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`${API_URL}api/books/search?query=${query}`);
                console.log('Search Results:', response.data); // Log dữ liệu nhận được
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div>
            <h1>Search Results</h1>
            <BookTable books={books} />
        </div>
    );
}

export default SearchResults;
