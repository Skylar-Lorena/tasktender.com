import React from 'react';

export default function TaskCard({ task, currentUserId, onSelectTask }) {
  // Extract poster ID safely whether posterId is an Object or a String
  const posterIdString = typeof task.posterId === 'object' ? task.posterId?._id : task.posterId;
  const isPoster = String(posterIdString) === String(currentUserId);

  return (
    <div
      onClick={() => onSelectTask(task)}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center"
    >
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {task.category || 'Errand'}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            {task.status || 'OPEN'}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900">
          {task.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
        <p className="text-[11px] text-gray-400">
           {task.location?.addressName || task.addressName || 'Nairobi'}
        </p>
      </div>

      <div className="text-right">
        <p className="text-base font-extrabold text-emerald-600">KES {task.budget}</p>
        <button className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-1 rounded transition">
          {isPoster ? 'Manage Task' : 'Place Bid'}
        </button>
      </div>
    </div>
  );
}