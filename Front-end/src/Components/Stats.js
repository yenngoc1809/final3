import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookIcon from '@material-ui/icons/Book';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

function Stats() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalReservations: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Gọi API để lấy danh sách sách
                const booksRes = await axios.get(`${API_URL}api/books/allbooks`);

                // Gọi API hiện có để lấy tổng số người dùng và tổng số đặt chỗ
                const usersRes = await fetchTotalUsers();
                const reservationsRes = await fetchTotalReservations();

                // Log dữ liệu trả về từ API để kiểm tra
                console.log('Books:', booksRes.data);
                console.log('Users:', usersRes.data);
                console.log('Reservations:', reservationsRes.data);

                // Tính toán số lượng và cập nhật trạng thái
                setStats({
                    totalBooks: booksRes.data.length,
                    totalUsers: usersRes.length,
                    totalReservations: reservationsRes.length
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    // Hàm để lấy tổng số người dùng từ API hiện có
    const fetchTotalUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}api/users/allmembers`); // Thay thế bằng endpoint thực tế của bạn
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    // Hàm để lấy tổng số đặt chỗ từ API hiện có
    const fetchTotalReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}api/transactions/all-transactions`); // Thay thế bằng endpoint thực tế của bạn
            return response.data;
        } catch (error) {
            console.error("Error fetching reservations:", error);
            return [];
        }
    };

    return (
        <div className='stats'>
            <div className='stats-block'>
                <LibraryBooksIcon className='stats-icon' style={{ fontSize: 80 }} />
                <p className='stats-title'>Total Books</p>
                <p className='stats-count'>{stats.totalBooks}</p>
            </div>
            <div className='stats-block'>
                <LocalLibraryIcon className='stats-icon' style={{ fontSize: 80 }} />
                <p className='stats-title'>Total Members</p>
                <p className='stats-count'>{stats.totalUsers}</p>
            </div>
            <div className='stats-block'>
                <BookIcon className='stats-icon' style={{ fontSize: 80 }} />
                <p className='stats-title'>Reservations</p>
                <p className='stats-count'>{stats.totalReservations}</p>
            </div>
        </div>
    );
}

export default Stats;
