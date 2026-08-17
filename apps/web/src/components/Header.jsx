import React from 'react';

export default function Header({ user }) {
  return (
    <header className="bg-brand text-white py-3 px-6 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img 
          src="/logo.png" 
          alt="TaskTender Logo" 
          className="w-8 h-8 object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <h1 className="text-lg font-bold tracking-wider leading-none">TASK TENDER</h1>
          <p className="text-[10px] text-gray-300 tracking-widest">CHEKI. TENDA. CHEQUE IT</p>
        </div>
      </div>
      {user && (
        <div className="text-sm font-medium bg-brand-dark px-3 py-1 rounded">
          {user.fullName}
        </div>
      )}
    </header>
  );
}