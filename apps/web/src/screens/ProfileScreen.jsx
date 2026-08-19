import React from 'react';

export default function ProfileScreen({ user, onLogout }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src="/logo.png"
          alt="Profile Avatar"
          className="w-16 h-16 rounded-full border-2 border-brand p-1 object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'TaskTender User'}</h2>
          <p className="text-xs text-gray-500">{user.phoneNumber}</p>
          <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
            Verified Phone Account
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 p-3 rounded">
        <div>
          <p className="text-lg font-bold text-brand">4.9 ★</p>
          <p className="text-[10px] text-gray-500 uppercase">Trust Rating</p>
        </div>
        <div>
          <p className="text-lg font-bold text-brand">12</p>
          <p className="text-[10px] text-gray-500 uppercase">Gigs Done</p>
        </div>
        <div>
          <p className="text-lg font-bold text-brand">100%</p>
          <p className="text-[10px] text-gray-500 uppercase">Completion</p>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-sm font-bold text-brand">Recent Feedback</h3>
        <div className="bg-gray-50 p-2.5 rounded text-xs space-y-1">
          <p className="font-semibold text-gray-800">"Delivered Sarit groceries on time!"</p>
          <p className="text-gray-500 text-[10px]">- Posted by Jane M. • 2 days ago</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-red-50 text-red-700 font-bold py-2 rounded text-sm hover:bg-red-100 transition"
      >
        Sign Out
      </button>
    </div>
  );
}