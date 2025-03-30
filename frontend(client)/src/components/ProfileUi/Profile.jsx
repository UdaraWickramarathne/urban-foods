import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Profile.css';
import storeContext from "../../context/storeContext";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    businessName: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const {setToken, setUserId, setRole} = storeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint =
          userType === 'supplier'
            ? `http://localhost:5000/api/suppliers/${userId}`
            : `http://localhost:5000/api/customers/${userId}`;
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          console.error('Failed to fetch user data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const endpoint =
        userType === 'supplier'
          ? `http://localhost:5000/api/suppliers/editSupplier/${userId}`
          : `http://localhost:5000/api/customers/editCustomer/${userId}`;
      const response = await axios.put(endpoint, userData);
      if (response.data.success) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update profile: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        const endpoint =
          userType === 'supplier'
            ? `http://localhost:5000/api/suppliers/deleteSupplier/${userId}`
            : `http://localhost:5000/api/customers/deleteCustomer/${userId}`;
        const response = await axios.delete(endpoint);
        if (response.data.success) {
          alert("Profile deleted successfully!");
          handleLogout();
          navigate("/");
        } else {
          alert("Failed to delete profile: " + response.data.message);
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("An error occurred while deleting the profile.");
      }
    }
  };

  const handleLogout = () => {
    setToken("");
    setUserId("");
    setRole("");
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="top-bar"></div>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="pro">
              <img
                src={userData.imageUrl || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="profile-pic"
              />
            </div>
            <div className="pro">
              <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="email">{userData.email}</p>
            </div>
          </div>
          <div className="button-group">
            <button className="edit-btn" onClick={handleEditClick}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>

        <div className="profile-form">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              placeholder="Your First Name"
              disabled={!isEditing}
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              placeholder="Your Last Name"
              disabled={!isEditing}
            />
          </div>
          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              placeholder="Your Address"
              disabled={!isEditing}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              disabled={!isEditing}
            />
          </div>
          {userType === 'supplier' && (
            <>
              <div className="input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={userData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                  disabled={!isEditing}
                />
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <div className="email-section">
            <button className="add-email-btn" onClick={handleSaveClick}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;