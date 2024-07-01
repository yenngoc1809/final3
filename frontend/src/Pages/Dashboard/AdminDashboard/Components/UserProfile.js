import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../../../Context/AuthContext";
import axios from "axios";
import './UserProfile.css';

function UserProfile() {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                console.log("Fetching user details for user ID:", user._id);
                const response = await axios.get(`${API_URL}api/users/getuser/${user._id}`);
                console.log("User details fetched:", response.data);
                setFormData(response.data);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to fetch user details. Please try again.");
            }
        };

        if (user && user._id) {
            fetchUserDetails();
        }
    }, [user, API_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            console.log("Updating profile with data:", formData);
            const response = await axios.put(`${API_URL}api/users/updateuser/${user._id}`, {
                ...formData,
                userId: user._id,
                isAdmin: user.isAdmin
            });
            console.log("Profile updated:", response.data);
            setFormData(response.data);
            setIsEditing(false);
            alert("Profile updated successfully");
        } catch (err) {
            console.error("Error updating profile:", err);
            let errorMessage = "Failed to update profile. Please try again.";
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!formData || Object.keys(formData).length === 0) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="member-profile-content" id="profile@member">
            <div className="user-details-topbar">
                <img
                    className="user-profileimage"
                    src="./assets/images/Profile.png"
                    alt="Profile"
                />
                <div className="user-info">
                    <p className="user-name">{formData.userFullName}</p>
                    <p className="user-id">
                        {formData.userType === "Student"
                            ? formData.admissionId
                            : formData.employeeId}
                    </p>
                    <p className="user-email">{formData.email}</p>
                    <p className="user-phone">{formData.mobileNumber}</p>
                </div>
            </div>
            <div className="user-details-specific">
                <div className="specific-left">
                    <div className="specific-left-top">
                        <p className="specific-left-topic">
                            <span style={{ fontSize: "18px" }}>
                                <b>Age</b>
                            </span>
                            <span style={{ fontSize: "16px" }}>
                                {formData.age}
                            </span>
                        </p>
                        <p className="specific-left-topic">
                            <span style={{ fontSize: "18px" }}>
                                <b>Gender</b>
                            </span>
                            <span style={{ fontSize: "16px" }}>
                                {formData.gender}
                            </span>
                        </p>
                    </div>
                    <div className="specific-left-bottom">
                        <p className="specific-left-topic">
                            <span style={{ fontSize: "18px" }}>
                                <b>DOB</b>
                            </span>
                            <span style={{ fontSize: "16px" }}>
                                {formData.dob}
                            </span>
                        </p>
                        <p className="specific-left-topic">
                            <span style={{ fontSize: "18px" }}>
                                <b>Address</b>
                            </span>
                            <span style={{ fontSize: "16px" }}>
                                {formData.address}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="specific-right">
                    <div className="specific-right-top">
                        <p className="specific-right-topic">
                            <b>Points</b>
                        </p>
                        <p
                            style={{
                                fontSize: "25px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                            }}
                        >
                            {formData.points || 540}
                        </p>
                    </div>
                    <div className="dashboard-title-line"></div>
                    <div className="specific-right-bottom">
                        <p className="specific-right-topic">
                            <b>Rank</b>
                        </p>
                        <p
                            style={{
                                fontSize: "25px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                            }}
                        >
                            {formData.rank || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <button onClick={() => setIsEditing(!isEditing)}>Edit Profile</button>
                {isEditing && (
                    <form onSubmit={handleUpdate} className="edit-profile-form">
                        <label>
                            Full Name:
                            <input
                                type="text"
                                name="userFullName"
                                value={formData.userFullName || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Phone:
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Age:
                            <input
                                type="number"
                                name="age"
                                value={formData.age || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Gender:
                            <input
                                type="text"
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Date of Birth:
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button className="addbook-submit" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
