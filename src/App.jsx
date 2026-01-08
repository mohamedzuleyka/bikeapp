import { useState, useEffect } from "react";
import "./App.css";
import OrderDetails from "./components/OrderDetails";
import OrderHistory from "./components/OrderHistory";
import Sidebar from "./components/Sidebar";
import Services from "./components/Services";
import Products from "./components/Products";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";

// once the .env is added and the S3 bucket is linked, use the S3 bucket images, until then use the public images directory
// S3 bucket implementation occurs in lab 2
const imageUrl = import.meta.env.VITE_APP_S3_BUCKET_URL
  ? import.meta.env.VITE_APP_S3_BUCKET_URL
  : "images";
const COGNITO_AUTH_URL = import.meta.env.VITE_COGNITO_AUTH_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

function App() {
  const [bannerColor, setBannerColor] = useState("dark");
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [createReportButtonText, setText] = useState('Create Report');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  console.log(localStorage.getItem("idToken"));
  if (
    localStorage.getItem("idToken") == null ||
    localStorage.getItem("idToken") == ""
  ) {
    if (window.location.hash != null && window.location.hash != "") {
      const str = window.location.hash;
      const regex = /#id_token=([^&]+)/;
      const match = str.match(regex);

      if (match) {
        const idTokenValue = match[1];
        console.log(idTokenValue);
        localStorage.setItem("idToken", idTokenValue);
      } else {
        console.log("No match found");
      }
    }
  }

  useEffect(() => {
    // Check if idToken is available in localStorage
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      // If idToken is available, set isUserSignedIn to true
      setIsUserSignedIn(true);
    } else {
      // If idToken is not available, set isUserSignedIn to false
      setIsUserSignedIn(false);
    }
  }, []);

  const handleBannerButtonClick = (color) => {
    if (color !== "dark" && color !== "light") {
      console.error("Invalid color value. Must be 'dark' or 'light'.");
      return; // Exit the function if the color is invalid
    }
    setBannerColor(color);
  };

  const handleSignOut = () => {
    // Clear the ID token from localStorage
    localStorage.removeItem("idToken");

    // Clear the entire localStorage
    localStorage.clear();

    // Wait
    setTimeout(() => {
      window.location.href = `${COGNITO_AUTH_URL}/logout?client_id=${CLIENT_ID}&response_type=token&scope=email+openid&logout_uri=${REDIRECT_URI}&redirect_uri=${REDIRECT_URI}`;
    }, 1000);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    const idToken = localStorage.getItem("idToken");
    // send to backend via a POST request
    axios.post(`${API_GATEWAY_BASE_URL}/create-report`, {},{
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("got back response from create-report api", res.data)
        setText("Report Sent to Email")
      })
      .catch((err) => {
        // Handle the error appropriately, e.g., display an error message
        console.error("Error requesting report:", err);
      });
  };

  return (
    <main>
      <div className="App">
        <nav>
          <div className={`banner banner-${bannerColor}`}>
            {bannerColor === "dark" ? (
              <img src={`${imageUrl}/logo-black.png`} alt="" />
            ) : (
              <img src={`${imageUrl}/logo-white.png`} alt="" />
            )}
            <h1>AnyCompany bicycle parts</h1>
          </div>
        </nav>
        <div className="nav-menu">
          <Link to="/">Products</Link>

          {isUserSignedIn ? (
            <Link to="order_history">Order History</Link>
          ) : null}
          <a href="/#services">Services</a>
          <a href="/#location">Location</a>
          <a href="/#about-us">About us</a>
        </div>
        <div>
          {isUserSignedIn ? (
            // Render content for signed-in users
            <div>
              <div>Signed in as employee</div>
              <button
                onClick={handleCreateReport}
                disabled={isButtonDisabled}
                style={{
                  color: "white",
                  backgroundColor: "gray",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              >
                {createReportButtonText}
              </button>
              <button
                onClick={handleSignOut}
                style={{
                  color: "white",
                  backgroundColor: "gray",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Render content for signed-out users
            <div
              style={{
                marginTop: "15px",
              }}
            >
              <a
                href={`${COGNITO_AUTH_URL}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid&redirect_uri=${REDIRECT_URI}`}
              >
                Employee Login
              </a>
            </div>
          )}
        </div>
        <div className="flex-mid">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/order_history" element={<OrderHistory />} />
            <Route path="/lookup_order/:orderId" element={<OrderDetails />} />
          </Routes>
          <Sidebar setBannerColor={handleBannerButtonClick} />
        </div>

        <Services />
        <div className="footer">
          <p>
            © {new Date().getFullYear()}, Amazon Web Services, Inc. or its
            Affiliates. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
