import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="app-container">
      <div className="top-bar"></div>
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
        <div className="pro">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJvaV1OQyhRH7gTSBJkQWvBvwAURYuPYTUg&s"
            alt="Profile"
            className="profile-pic"
          />
          </div>
          <div className="pro">
            <h2>Alexa Rawles</h2>
            <p className="email">alexarawles@gmail.com</p>
          </div>
        </div>
        <button className="edit-btn">Edit</button>
      </div>

      <div className="profile-form">
        <div className="input-group">
          <label>First Name</label>
          <input type="text" placeholder="Your First Name" />
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <input type="text" placeholder="Your Last Name" />
        </div>
        <div className="input-group">
          <label>Address</label>
          <input type="text" placeholder="Your Address" />
        </div>
        <div className="input-group">
          <label>Country</label>
          <input type="text" placeholder="Your First Name" />
        </div>
        <div className="input-group">
          <label>Language</label>
          <select>
            <option>Sinhala</option>
            <option>English</option>
            <option>Japan</option>
          </select>
        </div>
        <div className="input-group">
          <label>Image URL</label>
          <input type="text" placeholder="Your Image URL" />
        </div>
      </div>

      <div className="email-section">
        <h3>My email Address</h3>
        <div className="email-box">
          <div className="email-info">
            <span className="email-icon">📧</span>
            <span>alexarawles@gmail.com</span>
            <span className="email-time">1 month ago</span>
          </div>
        </div>
        <button className="add-email-btn">+ Add Email Address</button>
      </div>
    </div>
    </div>
  );
}

export default Profile;