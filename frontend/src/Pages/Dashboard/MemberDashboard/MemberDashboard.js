import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard/AdminDashboard.css";
import "./MemberDashboard.css";
import UserProfile from "../AdminDashboard/Components/UserProfile";
import UserRequests from "../AdminDashboard/Components/UserRequests"; // Import UserRequests component

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BookIcon from "@material-ui/icons/Book";
import HistoryIcon from "@material-ui/icons/History";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import CloseIcon from "@material-ui/icons/Close";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { IconButton } from "@material-ui/core";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import moment from "moment";

function MemberDashboard() {
  const [active, setActive] = useState("profile");
  const [sidebar, setSidebar] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";
  const { user } = useContext(AuthContext);
  const [memberDetails, setMemberDetails] = useState(null);

  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        const response = await axios.get(API_URL + "api/users/getuser/" + user._id);
        setMemberDetails(response.data);
      } catch (err) {
        console.log("Error in fetching the member details", err);
      }
    };
    getMemberDetails();
  }, [API_URL, user]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
          <IconButton>
            {sidebar ? (
              <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
            ) : (
              <DoubleArrowIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
            )}
          </IconButton>
        </div>
        <div className={sidebar ? "dashboard-options active" : "dashboard-options"}>
          <div className="dashboard-logo">
            <LibraryBooksIcon style={{ fontSize: 50 }} />
            <p className="logo-name">LCMS</p>
          </div>
          <a
            href="#profile@member"
            className={`dashboard-option ${active === "profile" ? "clicked" : ""}`}
            onClick={() => {
              setActive("profile");
              setSidebar(false);
            }}
          >
            <AccountCircleIcon className="dashboard-option-icon" /> Profile
          </a>
          <a
            href="#activebooks@member"
            className={`dashboard-option ${active === "active" ? "clicked" : ""}`}
            onClick={() => {
              setActive("active");
              setSidebar(false);
            }}
          >
            <LocalLibraryIcon className="dashboard-option-icon" /> Active
          </a>
          <a
            href="#reservedbook@member"
            className={`dashboard-option ${active === "reserved" ? "clicked" : ""}`}
            onClick={() => {
              setActive("reserved");
              setSidebar(false);
            }}
          >
            <BookIcon className="dashboard-option-icon" /> Reserved
          </a>
          <a
            href="#history@member"
            className={`dashboard-option ${active === "history" ? "clicked" : ""}`}
            onClick={() => {
              setActive("history");
              setSidebar(false);
            }}
          >
            <HistoryIcon className="dashboard-option-icon" /> History
          </a>
          <a
            href="#requests@member"
            className={`dashboard-option ${active === "requests" ? "clicked" : ""}`}
            onClick={() => {
              setActive("requests");
              setSidebar(false);
            }}
          >
            <LibraryBooksIcon className="dashboard-option-icon" /> Requests
          </a>
          <a
            href="#profile@member"
            className={`dashboard-option ${active === "logout" ? "clicked" : ""}`}
            onClick={() => {
              logout();
              setSidebar(false);
            }}
          >
            <PowerSettingsNewIcon className="dashboard-option-icon" /> Log out{" "}
          </a>
        </div>

        <div className="dashboard-option-content">
          {active === "profile" && <UserProfile />}
          {active === "active" && (
            <div className="member-activebooks-content" id="activebooks@member">
              <p className="member-dashboard-heading">Issued</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book-Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {memberDetails?.activeTransactions
                    ?.filter((data) => data.transactionType === "Issued")
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{moment(data.fromDate).format("DD/MM/YYYY")}</td>
                        <td>{moment(data.toDate).format("DD/MM/YYYY")}</td>
                        <td>
                          {Math.floor(
                            (Date.parse(moment().format("MM/DD/YYYY")) - Date.parse(data.toDate)) /
                            86400000
                          ) <= 0
                            ? 0
                            : Math.floor(
                              (Date.parse(moment().format("MM/DD/YYYY")) - Date.parse(data.toDate)) /
                              86400000
                            ) * 10}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {active === "reserved" && (
            <div className="member-reservedbooks-content" id="reservedbooks@member">
              <p className="member-dashboard-heading">Reserved</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book-Name</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {memberDetails?.activeTransactions
                    ?.filter((data) => data.transactionType === "Reserved")
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{moment(data.fromDate).format("DD/MM/YYYY")}</td>
                        <td>{moment(data.toDate).format("DD/MM/YYYY")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {active === "requests" && <UserRequests />} {/* Render UserRequests component */}

          {active === "history" && (
            <div className="member-history-content" id="history@member">
              <p className="member-dashboard-heading">History</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book-Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {memberDetails?.activeTransactions
                    ?.filter((data) => data.transactionType === "Returned")
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{moment(data.fromDate).format("DD/MM/YYYY")}</td>
                        <td>{moment(data.toDate).format("DD/MM/YYYY")}</td>
                        <td>{data.fine}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;