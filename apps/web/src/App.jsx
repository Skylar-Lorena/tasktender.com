import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Show splash screen for 2.5 seconds on load
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-brand-canvas text-gray-900 flex flex-col">
      <Header user={user} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {!user ? (
          <AuthScreen onLoginSuccess={setUser} />
        ) : (
          <DashboardScreen user={user} />
        )}
      </main>
    </div>
  );
}