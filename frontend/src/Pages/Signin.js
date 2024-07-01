import React, { useContext, useState } from 'react';
import './Signin.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import Switch from '@material-ui/core/Switch';

function Signin() {
    const [isStudent, setIsStudent] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [identifier, setIdentifier] = useState(""); // Single field for ID/Email/Mobile
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userFullName, setUserFullName] = useState("");
    const [admissionId, setAdmissionId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState("");
    const { dispatch } = useContext(AuthContext);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

    const signupCall = async (userCredential) => {
        try {
            const res = await axios.post(`${API_URL}api/authentication/register`, userCredential);
            console.log("cre", userCredential);
            alert('Registration successful! Please log in.');
            setIsLogin(true);
        } catch (err) {
            console.error("Signup error:", err);
            if (err.response) {
                setError(err.response.data.message || "Registration failed. Please try again.");
            } else if (err.request) {
                setError("No response received from server. Please try again later.");
            } else {
                setError("Error in sending request. Please try again.");
            }
        }
    };

    const signinCall = async (userCredential) => {
        try {
            const res = await axios.post(`${API_URL}api/authentication/signin`, userCredential);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            alert('Login successful!');
        } catch (err) {
            console.error("Signin error:", err);
            if (err.response) {
                setError(err.response.data.message || "Login failed. Please try again.");
            } else if (err.request) {
                setError("No response received from server. Please try again later.");
            } else {
                setError("Error in sending request. Please try again.");
            }
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (isLogin) {
            const userCredential = { identifier, password };
            signinCall(userCredential);
        } else {
            const userCredential = {
                userType: isStudent ? "student" : "staff",
                userFullName,
                admissionId,
                employeeId,
                age,
                dob,
                gender,
                address,
                mobileNumber,
                email,
                password,
                isAdmin: !isStudent // Nếu là staff thì isAdmin sẽ là true
            };
            signupCall(userCredential);
        }
    };

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title">{isLogin ? "Log in" : "Sign up"}</h2>
                    <p className="line"></p>
                    <div className="persontype-question">
                        <p>Are you a Staff member?</p>
                        <Switch
                            checked={!isStudent}
                            onChange={() => setIsStudent(!isStudent)}
                            color="primary"
                        />
                    </div>
                    {error && <div className="error-message"><p>{error}</p></div>}
                    <div className="signin-fields">
                        {isLogin ? (
                            <>
                                <label htmlFor="identifier"><b>ID/Email/Mobile</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Admission ID, Employee ID, Email, or Mobile Number"
                                    name="identifier"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <label htmlFor="userFullName"><b>Full Name</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Full Name"
                                    name="userFullName"
                                    required
                                    value={userFullName}
                                    onChange={(e) => setUserFullName(e.target.value)}
                                />
                                <label htmlFor="admissionId"><b>Admission ID</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Admission ID"
                                    name="admissionId"
                                    value={admissionId}
                                    onChange={(e) => setAdmissionId(e.target.value)}
                                />
                                <label htmlFor="employeeId"><b>Employee ID</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Employee ID"
                                    name="employeeId"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                />
                                <label htmlFor="age"><b>Age</b></label>
                                <input
                                    className='signin-textbox'
                                    type="number"
                                    placeholder="Enter Age"
                                    name="age"
                                    required
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                                <label htmlFor="dob"><b>Date of Birth</b></label>
                                <input
                                    className='signin-textbox'
                                    type="date"
                                    placeholder="Enter Date of Birth"
                                    name="dob"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                                <label htmlFor="gender"><b>Gender</b></label>
                                <select
                                    className='signin-textbox'
                                    name="gender"
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                                <label htmlFor="address"><b>Address</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Address"
                                    name="address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <label htmlFor="email"><b>Email</b></label>
                                <input
                                    className='signin-textbox'
                                    type="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="mobileNumber"><b>Mobile Number</b></label>
                                <input
                                    className='signin-textbox'
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    name="mobileNumber"
                                    required
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                            </>
                        )}
                        <label htmlFor="password"><b>Password</b></label>
                        <input
                            className='signin-textbox'
                            type="password"
                            minLength='6'
                            placeholder="Enter Password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!isLogin && (
                            <>
                                <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
                                <input
                                    className='signin-textbox'
                                    type="password"
                                    minLength='6'
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </>
                        )}
                    </div>
                    <button className="signin-button" type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
                    {isLogin ? (
                        <a className="forget-pass" href="#home">Forgot password?</a>
                    ) : null}
                </form>
                <div className='signup-option'>
                    {isLogin ? (
                        <p className="signup-question">Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
                    ) : (
                        <p className="signup-question">Already have an account? <span onClick={() => setIsLogin(true)}>Log In</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Signin;
