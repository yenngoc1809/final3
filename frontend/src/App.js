import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home.js';
import Signin from './Pages/Signin.js';
import Allbooks from './Pages/Allbooks.js';
import Header from './Components/Header.js';
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard.js';
import MemberDashboard from './Pages/Dashboard/MemberDashboard/MemberDashboard.js';
import BookDetail from './Pages/BookDetail.js'; // Import BookDetail
import SearchResults from './Pages/SearchResults'; // Import SearchResults
import { AuthContext } from './Context/AuthContext.js';
// import Switch from '@material-ui/core/Switch';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={user ? <Navigate to={user.isAdmin ? '/dashboard@admin' : '/dashboard@member'} /> : <Signin />} />
          <Route path='/dashboard@member' element={user ? (user.isAdmin === false ? <MemberDashboard /> : <Navigate to='/' />) : <Navigate to='/' />} />
          <Route path='/dashboard@admin' element={user ? (user.isAdmin === true ? <AdminDashboard /> : <Navigate to='/' />) : <Navigate to='/' />} />
          <Route path='/allbooks' element={<Allbooks />} />
          <Route path='/search' element={<SearchResults />} /> {/* Sử dụng SearchResults */}
          <Route path='/book/:id' element={<BookDetail />} /> {/* Thêm Route cho BookDetail */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
