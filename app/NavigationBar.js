'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '../context/AuthContext';
import { logout as authLogout } from '../utils/authUtils'; // Import logout utility

const NavigationBar = () => {
  const { auth } = useAuth();
  const router = useRouter(); // Initialize useRouter
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure the component only renders after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Avoid rendering until hydration is complete
  }

  const handleLogout = () => {
    authLogout(() => router.push('/auth/sign-in')); // Redirect to sign-in page after logout
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hire Skill App
        </Typography>
        {!auth.isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} href="/auth/sign-in">
              Sign In
            </Button>
            <Button color="inherit" component={Link} href="/auth/sign-up">
              Sign Up
            </Button>
          </>
        ) : (
          <>
            {auth.role === 'user' && (
              <Button color="inherit" component={Link} href="/user/tasks">
                Tasks
              </Button>
            )}
            {auth.role === 'provider' && (
              <>
                <Button color="inherit" component={Link} href="/provider/skills">
                  Skills
                </Button>
                <Button color="inherit" component={Link} href="/provider/bid-task">
                  Bid Task
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;