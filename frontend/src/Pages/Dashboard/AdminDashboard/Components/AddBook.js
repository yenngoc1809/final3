import React, { useContext, useEffect, useState } from 'react';
import "../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from '../../../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';

function AddBook() {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const [bookName, setBookName] = useState("");
    const [alternateTitle, setAlternateTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCountAvailable, setBookCountAvailable] = useState(null);
    const [language, setLanguage] = useState("");
    const [publisher, setPublisher] = useState("");
    const [coverImageLink, setCoverImageLink] = useState(""); // New state for cover image link
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [recentAddedBooks, setRecentAddedBooks] = useState([]);

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories");
                const all_categories = response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ));
                setAllCategories(all_categories);
            } catch (err) {
                console.log(err);
                alert("Failed to fetch categories. Please try again.");
            }
        };
        getAllCategories();
    }, [API_URL]);
    const addBook = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const bookData = {
            bookName,
            alternateTitle,
            author,
            bookCountAvailable,
            language,
            publisher,
            coverImageLink, // Include cover image link in the data sent to backend
            categories: selectedCategories,
            isAdmin: user.isAdmin
        };

        try {
            console.log("Sending book data to backend:", bookData);
            const response = await axios.post(API_URL + "api/books/addbook", bookData);
            console.log("Received response:", response.data);

            if (recentAddedBooks.length >= 5) {
                setRecentAddedBooks(prevBooks => [response.data, ...prevBooks.slice(0, 4)]);
            } else {
                setRecentAddedBooks(prevBooks => [response.data, ...prevBooks]);
            }
            setBookName("");
            setAlternateTitle("");
            setAuthor("");
            setBookCountAvailable(null);
            setLanguage("");
            setPublisher("");
            setCoverImageLink(""); // Clear cover image link state
            setSelectedCategories([]);
            alert("Book Added Successfully 🎉");
        } catch (err) {
            console.error("Error adding book:", err.response ? err.response.data : err.message);
            alert("Failed to add book. Please try again.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const getAllBooks = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/allbooks");
                setRecentAddedBooks(response.data.slice(0, 5));
            } catch (err) {
                console.error("Error fetching books:", err);
                alert("Failed to fetch recent books. Please try again.");
            }
        };
        getAllBooks();
    }, [API_URL]);

    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>
                <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => setBookName(e.target.value)} required /><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">Alternate Title</label><br />
                <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => setAlternateTitle(e.target.value)} /><br />

                <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /><br />

                <label className="addbook-form-label" htmlFor="language">Language</label><br />
                <input className="addbook-form-input" type="text" name="language" value={language} onChange={(e) => setLanguage(e.target.value)} /><br />

                <label className="addbook-form-label" htmlFor="publisher">Publisher</label><br />
                <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} /><br />

                <label className="addbook-form-label" htmlFor="coverImageLink">Cover Image Link</label><br />
                <input className="addbook-form-input" type="text" name="coverImageLink" value={coverImageLink} onChange={(e) => setCoverImageLink(e.target.value)} /><br />

                <label className="addbook-form-label" htmlFor="bookCountAvailable">No. of Copies Available<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="number" name="bookCountAvailable" value={bookCountAvailable} onChange={(e) => setBookCountAvailable(e.target.value)} required /><br />

                <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder='Category'
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories}
                        onChange={(event, data) => setSelectedCategories(data.value)}
                    />
                </div>

                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading} /><br />
            </form>
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tbody>
                        <tr>
                            <th>S.No</th>
                            <th>Book Name</th>
                            <th>Added Date</th>
                        </tr>
                        {recentAddedBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{book.bookName}</td>
                                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddBook;
