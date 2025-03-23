import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";
import animationData from "../../assets/success.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const orderData = JSON.parse(localStorage.getItem("orderData")) || {};
  const [details, setDetails] = useState(orderData);
  const { token, url, setCartDetails, setOrderDetails } =
    useContext(StoreContext);

  useEffect(() => {
    console.log("Order data:", details);

    const saveOrderData = async () => {
      try {
        const response = await axios.post(`${url}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          localStorage.removeItem("orderData");
          setCartDetails({
            itemCount: 0,
            totalAmount: 0.0,
          });
          setOrderDetails([]);
        } else {
          alert("Order failed!");
        }
      } catch (error) {
        console.error("Error saving order data:", error);
        alert("An error occurred while saving order data.");
      }
    };
    saveOrderData();
  }, []);

  function formatDateToUS(isoDateString) {
    if (!isoDateString) return "N/A"; // Handle missing date
    const date = new Date(isoDateString);

    // Add validation for Date object
    if (isNaN(date)) {
      console.error("Invalid date string:", isoDateString);
      return "Invalid Date";
    }

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("en-US", options);
  }

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
