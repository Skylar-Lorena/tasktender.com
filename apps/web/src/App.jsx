import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('DASHBOARD'); // DASHBOARD | PROFILE

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-brand-canvas text-gray-900 flex flex-col">
      <Header user={user} onProfileClick={() => setCurrentTab(currentTab === 'PROFILE' ? 'DASHBOARD' : 'PROFILE')} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {!user ? (
          <AuthScreen onLoginSuccess={setUser} />
        ) : currentTab === 'PROFILE' ? (
          <ProfileScreen user={user} onLogout={() => { setUser(null); setCurrentTab('DASHBOARD'); }} />
        ) : (
          <DashboardScreen user={user} />
        )}
      </main>
    </div>
  );
}