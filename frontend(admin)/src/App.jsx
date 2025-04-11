import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

// Create a separate component that uses auth context
function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Login /> : <Dashboard />;
}

export default App;
