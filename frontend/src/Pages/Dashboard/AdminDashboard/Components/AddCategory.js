import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [recentAddedCategories, setRecentAddedCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}api/categories/allcategories`);
            setRecentAddedCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories. Please try again.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!categoryName) {
            setError('Category name must be filled');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}api/categories/addcategory`, { categoryName });
            setRecentAddedCategories([response.data, ...recentAddedCategories.slice(0, 4)]);
            setCategoryName('');
            alert('Category Added');
        } catch (err) {
            console.error('Error adding category:', err);
            setError(`Failed to add category. ${err.response ? err.response.data.details : 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p className="dashboard-option-title">Add a Category</p>
            <div className="dashboard-title-line"></div>
            <form className="addcategory-form" onSubmit={addCategory}>
                <label className="addcategory-form-label" htmlFor="categoryName">Category Name<span className="required-field">*</span></label><br />
                <input
                    className="addcategory-form-input"
                    type="text"
                    name="categoryName"
                    value={categoryName}
                    required
                    onChange={(e) => setCategoryName(e.target.value)}
                /><br />
                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading} /><br />
                {error && <p className="error-message">{error}</p>}
            </form>
            <p className="dashboard-option-title">Recently Added Categories</p>
            <div className="dashboard-title-line"></div>
            <table className='admindashboard-table'>
                <tbody>
                    <tr>
                        <th>S.No</th>
                        <th>Category Name</th>
                    </tr>
                    {recentAddedCategories.map((category, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{category.categoryName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddCategory;
