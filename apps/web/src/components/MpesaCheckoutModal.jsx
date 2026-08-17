import React, { useState } from 'react';

export default function MpesaCheckoutModal({ task, user, onClose, onPaymentSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [step, setStep] = useState('CONFIRM'); // CONFIRM | WAITING | SUCCESS
  const [checkoutId, setCheckoutId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task._id,
          posterId: user.id,
          taskerId: task.acceptedTaskerId || '66b27e9987654321fedcba02',
          phoneNumber,
          amount: task.budget
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setCheckoutId(data.checkoutRequestId);
        setStep('WAITING');
      } else {
        setError(data.error || 'Failed to trigger M-Pesa STK push');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection failed');
    }
  };

  const handleSimulateCallback = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/mpesa/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Body: {
            stkCallback: {
              MerchantRequestID: 'DEV_REQ_001',
              CheckoutRequestID: checkoutId,
              ResultCode: 0,
              ResultDesc: 'Success',
              CallbackMetadata: {
                Item: [{ Name: 'MpesaReceiptNumber', Value: 'RKT992211A' }]
              }
            }
          }
        })
      });
      const data = await res.json();
      setLoading(false);
      if (data.ResultCode === 0) {
        setStep('SUCCESS');
        onPaymentSuccess();
      }
    } catch (err) {
      setLoading(false);
      setError('Callback verification failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
        <h3 className="text-lg font-bold text-brand mb-2">M-Pesa Escrow Lock</h3>
        <p className="text-xs text-gray-500 mb-4">
          Funds are locked safely in escrow and only released when you approve completed work.
        </p>

        {error && <div className="p-2 mb-3 text-xs bg-red-100 text-red-700 rounded">{error}</div>}

        {step === 'CONFIRM' && (
          <form onSubmit={handleInitiatePayment} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded">
              <p className="text-xs text-emerald-800 font-medium">Task: {task.title}</p>
              <p className="text-lg font-bold text-emerald-900 mt-1">Total: KES {task.budget}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">M-Pesa Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand text-white font-bold py-2 rounded text-sm hover:bg-brand-dark"
              >
                {loading ? 'Prompting...' : 'Pay with M-Pesa'}
              </button>
            </div>
          </form>
        )}

        {step === 'WAITING' && (
          <div className="text-center py-4 space-y-4">
            <div className="animate-pulse text-brand font-bold text-sm">
              Check your phone for the M-Pesa PIN prompt...
            </div>
            <p className="text-xs text-gray-500">Checkout ID: {checkoutId}</p>
            <button
              type="button"
              onClick={handleSimulateCallback}
              disabled={loading}
              className="w-full bg-emerald-700 text-white font-bold py-2 rounded text-sm"
            >
              {loading ? 'Verifying...' : 'Simulate PIN Confirmation (Dev)'}
            </button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-3">
            <div className="text-green-600 font-bold text-lg">Escrow Funded!</div>
            <p className="text-xs text-gray-600">
              Your KES {task.budget} payment is securely locked.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-brand text-white font-bold py-2 rounded text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}