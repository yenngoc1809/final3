import React, { useEffect, useState } from 'react';
import "../AdminDashboard.css";
import axios from "axios";
import { Dropdown } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

function AddMember() {


    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
    const [isLoading, setIsLoading] = useState(false);

    const [userFullName, setUserFullName] = useState('');
    const [admissionId, setAdmissionId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(null);
    const [dobString, setDobString] = useState('');
    const [userType, setUserType] = useState('');
    const [recentAddedMembers, setRecentAddedMembers] = useState([]);

    const userTypes = [
        { value: 'Staff', text: 'Staff' },
        { value: 'Student', text: 'Student' }
    ];

    const genders = [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
    ];

    const addMember = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (userFullName && userType && dobString && gender && address && mobileNumber && email && password) {
            const userData = {
                userType,
                userFullName,
                admissionId: userType === "Student" ? admissionId : undefined,
                employeeId: userType === "Staff" ? employeeId : undefined,
                dob: dobString,
                gender,
                address,
                mobileNumber,
                email,
                password
            };

            try {
                const response = await axios.post(`${API_URL}api/authentication/register`, userData);
                if (recentAddedMembers.length >= 5) {
                    recentAddedMembers.pop();
                }
                setRecentAddedMembers([response.data, ...recentAddedMembers]);
                setUserFullName('');
                setUserType('');
                setAdmissionId('');
                setEmployeeId('');
                setAddress('');
                setMobileNumber('');
                setEmail('');
                setPassword('');
                setGender('');
                setDob(null);
                setDobString('');
                alert("Member Added");
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("All the fields must be filled");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(`${API_URL}api/users/allmembers`);
                const recentMembers = response.data.slice(0, 5);
                setRecentAddedMembers(recentMembers);
            } catch (err) {
                console.error(err);
            }
        };
        getMembers();
    }, [API_URL]);

    return (
        <div>
            <p className="dashboard-option-title">Add a Member</p>
            <div className="dashboard-title-line"></div>
            <form className="addmember-form" onSubmit={addMember}>
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        options={userTypes}
                        onChange={(event, data) => setUserType(data.value)}
                    />
                </div>
                <label className="addmember-form-label" htmlFor="userFullName">Full Name<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" name="userFullName" value={userFullName} required onChange={(e) => setUserFullName(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor={userType === "Student" ? "admissionId" : "employeeId"}>{userType === "Student" ? "Admission Id" : "Employee Id"}<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={userType === "Student" ? admissionId : employeeId} required onChange={(e) => { userType === "Student" ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }}></input><br />

                <label className="addmember-form-label" htmlFor="gender">Gender<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Gender'
                        fluid
                        selection
                        options={genders}
                        onChange={(event, data) => setGender(data.value)}
                    />
                </div>

                <label className="addmember-form-label" htmlFor="dob">Date of Birth<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={dob}
                    onChange={(date) => { setDob(date); setDobString(moment(date).format("MM/DD/YYYY")) }}
                    dateFormat="MM/dd/yyyy"
                />

                <label className="addmember-form-label" htmlFor="address">Address<span className="required-field">*</span></label><br />
                <input className="addmember-form-input address-field" value={address} type="text" required onChange={(e) => setAddress(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="mobileNumber">Mobile Number<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="email">Email<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="email" value={email} required onChange={(e) => setEmail(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="password">Password<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br />

                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
            </form>
            <p className="dashboard-option-title">Recently Added Members</p>
            <div className="dashboard-title-line"></div>
            <table className='admindashboard-table'>
                <tbody>
                    <tr>
                        <th>S.No</th>
                        <th>Member Type</th>
                        <th>Member ID</th>
                        <th>Member Name</th>
                    </tr>
                    {
                        recentAddedMembers.map((member, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{member.userType}</td>
                                    <td>{member.userType === "Student" ? member.admissionId : member.employeeId}</td>
                                    <td>{member.userFullName}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default AddMember;
