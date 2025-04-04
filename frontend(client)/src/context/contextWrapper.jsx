import React from "react";
import { NotificationProvider } from "./notificationContext";
import { MainProvider } from "./mainContext";
import { CartProvider } from "./CartContext";

export const ContextWrapper = ({ children }) => {
  return (
    <NotificationProvider>
      <MainProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </MainProvider>
    </NotificationProvider>
  );
};
