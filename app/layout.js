'use client';

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import NavigationBar from './NavigationBar.js';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavigationBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}