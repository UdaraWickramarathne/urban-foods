import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";
import animationData from "../../assets/success.json";
import Lottie from "lottie-react";


const PaymentSuccess = () => {

  return (
    <div className="success-container">
      <div className="success-content">
        <Lottie animationData={animationData} loop={true} autoplay={true} />
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </p>

        <div className="transaction-details">
          <h2>Transaction Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span>Amount Paid:</span>
              <span>${details.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="detail-item">
              <span>Date:</span>
              <span>{formatDateToUS(details?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="button primary">Download Receipt</button>
          <button className="button secondary" onClick={() => navigate("/")}>
            Return to Dashboard
          </button>
        </div>

        <p className="email-confirmation">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;