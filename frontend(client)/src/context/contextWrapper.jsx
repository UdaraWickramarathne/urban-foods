import React from 'react';
import { NotificationProvider } from './notificationContext';
import { MainProvider } from './mainContext';


export const ContextWrapper = ({ children }) => {
  return (
    <NotificationProvider>
      <MainProvider>
        {children}
      </MainProvider>
    </NotificationProvider>
  );
};