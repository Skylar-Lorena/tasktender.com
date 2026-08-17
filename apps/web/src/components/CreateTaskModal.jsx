import React, { useState } from 'react';
import { api } from '../services/api';

export default function CreateTaskModal({ user, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Errands');
  const [budget, setBudget] = useState('');
  const [locationName, setLocationName] = useState('Nairobi CBD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resolves user ID safely across _id, id, or userId formats
  const posterId = user?._id || user?.id || user?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!posterId) {
      setError('User session invalid. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        posterId,
        title,
        description,
        category,
        budget: Number(budget),
        location: {
          addressName: locationName,
          coordinates: [36.8219, -1.2921] // Default Nairobi coordinates
        }
      };

      const data = await api.createTask(payload);
      setLoading(false);

      if (data.success) {
        onTaskCreated(data.task);
        onClose();
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error. Make sure your backend API is running.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-brand">Post a New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="p-2.5 mb-3 text-xs font-medium bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Task Title</label>
            <input
              type="text"
              placeholder="e.g., Pick up package from Westlands"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand bg-white"
            >
              <option value="Errands">Errands</option>
              <option value="Delivery">Delivery</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Handyman">Handyman</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Budget (KES)</label>
            <input
              type="number"
              placeholder="e.g., 1500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Location / Pickup Point</label>
            <input
              type="text"
              placeholder="e.g., Nairobi CBD"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Description & Instructions</label>
            <textarea
              placeholder="Specify clear instructions for the Tasker..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-brand h-20 resize-none"
              required
            ></textarea>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand text-white font-bold py-2 rounded text-sm hover:bg-brand-dark transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}