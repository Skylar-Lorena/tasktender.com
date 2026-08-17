import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-brand flex flex-col items-center justify-center z-50 text-white animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        {/* TaskTender Logo */}
        <img 
          src="/logo.png"
          alt="TaskTender Logo" 
          className="w-28 h-28 object-contain animate-bounce rounded-full"
          onError={(e) => {
            // Fallback placeholder container if logo.png fails
            e.target.style.display = 'none';
          }}
        />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-wider">TASK TENDER</h1>
          <p className="text-sm text-gray-200 tracking-widest mt-1">CHEKI. TENDA. CHEQUE IT</p>
        </div>
      </div>
    </div>
  );
}