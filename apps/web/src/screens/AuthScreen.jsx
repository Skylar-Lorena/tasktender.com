import React, { useState } from 'react';
import { api } from '../services/api';

export default function AuthScreen({ onLoginSuccess }) {
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.requestOtp(phoneNumber);
      setLoading(false);
      if (data.success) setStep('OTP');
      else setError(data.error || 'Failed to request code');
    } catch (err) {
      setLoading(false);
      setError('Unable to reach auth server');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.verifyOtp(phoneNumber, otp, fullName);
      setLoading(false);
      if (data.success) onLoginSuccess(data.user);
      else setError(data.error || 'Invalid OTP');
    } catch (err) {
      setLoading(false);
      setError('Verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex justify-center mb-4">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
      </div>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      {step === 'PHONE' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <h2 className="text-lg font-bold text-brand">Sign In / Register</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+254 7XX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-2.5 rounded hover:bg-brand-dark">
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <h2 className="text-lg font-bold text-brand">Verify Phone</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Skylar Lorena"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Verification Code (Use 1234 in dev)</label>
            <input
              type="text"
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-2.5 rounded hover:bg-brand-dark">
            {loading ? 'Verifying...' : 'Verify and Sign In'}
          </button>
        </form>
      )}
    </div>
  );
}