import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

// Create a separate component that uses auth context
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <NotificationProvider>
      {!isAuthenticated ? <Login /> : <Dashboard />}
    </NotificationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
