'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getRole } from '../utils/authUtils';

const HomePage = () => {
  const router = useRouter();

  const handleNavigation = () => {
    if (!isAuthenticated()) {
      router.push('/auth/sign-in');
    } else {
      const role = getRole();
      if (role === 'user') router.push('/user/tasks');
      else router.push('/provider/skills');
    }
  };

  return (
    <div>
      <h1>Welcome to Hire Skill App</h1>
      <button onClick={handleNavigation}>Get Started</button>
    </div>
  );
};

export default HomePage;