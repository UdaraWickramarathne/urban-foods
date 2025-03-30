import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Profile.css';
import storeContext from "../../context/storeContext";
import { CUSTOMERS, SUPPLIERS, CUSTOMER_IMAGES, SUPPLIER_IMAGES, } from '../../context/constants';
import { FaPencilAlt } from 'react-icons/fa';

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
  const userType = localStorage.getItem('userType');
  const { setToken, setUserId, setRole } = storeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint =
          userType === 'supplier'
            ? `${SUPPLIERS}/${userId}`
            : `${CUSTOMERS}/${userId}`;
        const response = await axios.get(endpoint);
        if (response.data.success) {
          const userData = response.data.data;
          if (userData.imageUrl && !userData.imageUrl.startsWith('http')) {
            userData.imageUrl = `${userType === 'supplier' ? SUPPLIER_IMAGES : CUSTOMER_IMAGES}/${userData.imageUrl}`;
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
  }, [userId, userType]);

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
        userType === 'supplier'
          ? `${SUPPLIERS}/editSupplier/${userId}`
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
        alert('Profile updated successfully!');
        setIsEditing(false);

        const updatedImageUrl = response.data.data.imageUrl.startsWith('http')
          ? response.data.data.imageUrl
          : `${userType === 'supplier' ? SUPPLIER_IMAGES : CUSTOMER_IMAGES}/${response.data.data.imageUrl}`;
  
        setUserData((prevData) => ({
          ...prevData,
          imageUrl: updatedImageUrl,
        }));
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
            ? `${SUPPLIERS}/deleteSupplier/${userId}`
            : `${CUSTOMERS}/delete/${userId}`;
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
              <div className="profile-pic-container">
                <img
                  src={userData.imageUrl ? userData.imageUrl : 'assets/egg.png'}
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