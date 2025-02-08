import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../assets/file_icon.png';
import PlusIcon from '../assets/plus_icon.png';
import settingIcon from '../assets/settingIcon.png';
import deleteIcon from '../assets/deleteIcon.png';
import * as XLSX from 'xlsx';

const Page1 = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const usersPerPage = 5;

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const displayedUsers = users.slice((page - 1) * usersPerPage, page * usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    navigate(`/page${newPage}`);
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'User_Data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  return (
    <div className='window'>
      <div className='header'>
        <div className='header1'>User Management</div>
        <div className='header2'>
          <button className='span0' onClick={exportToExcel}>
            <span className='span1'><img src={Icon} alt="Icon" className='fileIcon' /></span>
            <span className='span2'> Export to Excel</span>
          </button>
        </div>
        <div className='header2 header3'>
          <button className='span0'>
            <span className='span1'><img src={PlusIcon} alt="PlusIcon" className='fileIcon' /></span>
            <span className='span2'> Add New User </span>
          </button>
        </div>
      </div>
      <table className='table'>
        <thead>
          <tr className='title'>
            <th className='body05'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#</th>
            <th className='body1'>&nbsp;Name</th>
            <th className='body1'>Date Created</th>
            <th className='body1'>Role</th>
            <th className='body1'>Status</th>
            <th className='body05'>Action</th>
          </tr>
        </thead>
        <tbody>
          <hr style={{ border: "1px solid #E9E9E9", width: "100%", margin: "auto" }} />
          {displayedUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <tr className='title'>
                <td className='body05'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{(page - 1) * usersPerPage + index + 1}</td>
                <td className='body1'><img src={user.avatar} alt="Avatar" className='avatarIcon' />&nbsp;&nbsp;{user.name}</td>
                <td className='body1'>&nbsp;&nbsp;{user.date_created}</td>
                <td className='body1'>{user.role}</td>
                <td className='body1'><img src={user.dot} alt="Status" className='dotIcon' />&nbsp;{user.status}</td>
                <td className='body05'>
                  <img src={settingIcon} alt="Settings" className='settingIcon' />&nbsp;&nbsp;&nbsp;
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className='deleteIcon'
                    onClick={() => deleteUser(user.id)}
                  />
                </td>
              </tr>
              <hr style={{ border: "1px solid #E9E9E9", width: "100%", margin: "auto" }} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className='footer'>
        <div className='footer1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Showing <strong>&nbsp;{displayedUsers.length}</strong>&nbsp;out of<strong>&nbsp;{users.length}</strong>&nbsp;entries</div>
        <div className='footer2'>
          <div className='prenext'>
            <Link to="#" onClick={() => handlePageChange(page - 1)} style={{
              pointerEvents: page > 1 ? 'auto' : 'none', color: page > 1 ? '#228BE6' : 'gray', transition: 'background-color 0.3s ease', textDecoration: 'none' }}>
              Previous
            </Link>
          </div>
          {[...Array(totalPages)].map((_, index) => (
            <div className='numbers' key={index} style={{ backgroundColor: page === index + 1 ? '#289AE7' : 'transparent', color: page === index + 1 ? 'white' : 'black', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}>
              <Link to="#" onClick={() => handlePageChange(index + 1)} style={{textDecoration: 'none', color: page === index + 1 ? 'white' : 'black' }}>
                {index + 1}
              </Link>
            </div>
          ))}
          <div className='prenext'>
            <Link to="#" onClick={() => handlePageChange(page + 1)} style={{
              pointerEvents: page < totalPages ? 'auto' : 'none', color: page < totalPages ? '#228BE6' : 'gray', transition: 'background-color 0.3s ease', textDecoration: 'none' }}>
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1;
