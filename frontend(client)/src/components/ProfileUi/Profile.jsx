import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Profile.css';
import storeContext from "../../context/storeContext";
import { CUSTOMERS, SUPPLIERS, CUSTOMER_IMAGES, SUPPLIER_IMAGES, GET_USER, } from '../../context/constants';
import { FaPencilAlt, FaUserEdit, FaTrashAlt, FaSave } from 'react-icons/fa';
import { useNotification } from '../../context/notificationContext';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    businessName: '',
    imageUrl: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const { setToken, setUserId, setRole } = storeContext();
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Role:', role, 'UserId:', userId);
      try {
        const endpoint =
          role === 'supplier'
            ? `${SUPPLIERS}/${userId}`
            : `${CUSTOMERS}/${userId}`;
        const response = await axios.get(endpoint);
        if (response.data.success) {
          const userData = response.data.data;
          if (userData.imageUrl && !userData.imageUrl.startsWith('http')) {
            userData.imageUrl = `${role === 'supplier' ? SUPPLIER_IMAGES : CUSTOMER_IMAGES}/${userData.imageUrl}`;
          }
          console.log('Fetched User Data:', userData);
          setUserData(userData);
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
  }, [userId, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const endpoint =
        role === 'supplier'
          ? `${SUPPLIERS}/${userId}`
          : `${CUSTOMERS}/update/${userId}`;

      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (key !== 'imageUrl') {
          formData.append(key, userData[key]);
        }
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }

      const response = await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        showNotification('Profile updated successfully!', 'success');
        setIsEditing(false);

        const updatedImageUrl = response.data.data.imageUrl.startsWith('http')
          ? response.data.data.imageUrl
          : `${role === 'supplier' ? SUPPLIER_IMAGES : CUSTOMER_IMAGES}/${response.data.data.imageUrl}`;

        setUserData((prevData) => ({
          ...prevData,
          imageUrl: updatedImageUrl,
        }));
      } else {
        showNotification('Failed to update profile: ' + response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${GET_USER}/${userId}`);
        if (response.data.success) {
          showNotification("Profile deleted successfully!", "success");
          handleLogout();
          navigate("/");
        } else {
          showNotification("Failed to delete profile: " + response.data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        showNotification("An error occurred while deleting the profile.", "error");
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
              <div className="profile-pic-container">
                <img
                   src={userData.imageUrl && userData.imageUrl.trim() !== '' ? userData.imageUrl : 'default-image.jpg'}
                  alt="Profile"
                  className="profile-pic"
                />
                {isEditing && (
                  <div
                    className="edit-icon"
                    onClick={() => document.getElementById('profile-pic-input').click()}
                  >
                    <FaPencilAlt />
                  </div>
                )}
                <input
                  id="profile-pic-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="pro">
              {role === 'supplier' ? (
                <>
                  <h2>{userData.businessName || 'Company Name'}</h2>
                  <p className="email">{userData.email || 'email@example.com'}</p>
                </>
              ) : (
                <>
                  <h2>{`${userData.firstName || 'First'} ${userData.lastName || 'Last'}`}</h2>
                  <p className="email">{userData.email || 'email@example.com'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-form">
          {role !== 'supplier' && (
            <>
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
            </>
          )}
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
              placeholder="Your Email"
              disabled={true}
            />
          </div>
          {role === 'supplier' && (
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
          )}
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <div className="button-container">
              <button className="profile-btn edit-profile-btn" onClick={handleEditClick}>
                <FaUserEdit /> Edit Profile
              </button>
              <button className="profile-btn delete-profile-btn" onClick={handleDeleteClick}>
                <FaTrashAlt /> Delete Account
              </button>
            </div>
          ) : (
            <div className="button-container">
              <button className="profile-btn save-profile-btn" onClick={handleSaveClick}>
                <FaSave /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;