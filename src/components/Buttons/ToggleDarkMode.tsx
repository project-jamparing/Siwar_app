'use client';

import { useEffect, useState } from 'react';

export default function ToggleDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', prefersDark);
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setIsDark(newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 shadow transition-colors duration-300"
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}