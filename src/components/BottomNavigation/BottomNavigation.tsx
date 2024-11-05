// src/app/components/BottomNavigation/BottomNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/home', icon: '🏠' },
    { name: 'Play', path: '/play', icon: '🎮' },
    { name: 'Collections', path: '/collections', icon: '📚' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  ];

  return (
    <nav className="fixed    bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around items-center h-16">
      {navItems.map((item) => (
        <Link key={item.name} href={item.path}>
          <p className={`flex flex-col items-center ${pathname === item.path ? 'text-blue-500' : 'text-gray-500'}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </p>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
