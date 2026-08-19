import React from 'react';

export default function Header({ user, currentTab, onTabChange }) {
  return (
    <header className="bg-brand text-white py-3 px-6 shadow-md flex justify-between items-center">
      {/* Brand Logo & Name */}
      <div
        onClick={() => onTabChange('DASHBOARD')}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <img
          src="/logo.png"
          alt="TaskTender Logo"
          className="w-9 h-9 object-contain rounded-lg bg-white p-0.5"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <h1 className="text-lg font-bold tracking-wider leading-none">TASK TENDER</h1>
          <p className="text-[10px] text-gray-300 tracking-widest">CHEKI. TENDA. CHEQUE IT</p>
        </div>
      </div>

      {/* Profile Button */}
      {user && (
        <button
          onClick={() => onTabChange(currentTab === 'PROFILE' ? 'DASHBOARD' : 'PROFILE')}
          className="flex items-center space-x-2 bg-brand-dark hover:bg-black/20 px-3 py-1.5 rounded-lg border border-white/20 transition text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{user.fullName || 'My Account'}</span>
        </button>
      )}
    </header>
  );
}