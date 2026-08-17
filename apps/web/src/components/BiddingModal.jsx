import React, { useState } from 'react';
import { api } from '../services/api';

export default function BiddingModal({ task, user, onClose, onBidSubmitted }) {
  const [amount, setAmount] = useState(task.budget);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${task._id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskerId: user.id,
          amount: Number(amount),
          note
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        onBidSubmitted(data.bid);
        onClose();
      } else {
        setError(data.error || 'Failed to submit bid');
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs bg-gray-100 text-brand font-semibold px-2 py-0.5 rounded">
              {task.category || 'Errands'}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{task.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        <div className="bg-gray-50 p-3 rounded mb-4 text-xs space-y-1">
          <p><span className="font-semibold text-gray-700">Location:</span> {task.location?.addressName || 'Nairobi'}</p>
          <p><span className="font-semibold text-gray-700">Poster Budget:</span> KES {task.budget}</p>
        </div>

        {error && <div className="p-2 mb-3 text-xs bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Your Offer (KES)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Pitch Note to Poster</label>
            <textarea
              placeholder="Why are you the right person for this gig?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand h-20"
              required
            ></textarea>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand text-white font-bold py-2 rounded text-sm hover:bg-brand-dark"
            >
              {loading ? 'Submitting...' : 'Send Bid Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}