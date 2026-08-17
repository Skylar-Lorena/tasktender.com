import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function DashboardScreen({ user }) {
  const [activeRole, setActiveRole] = useState('POSTER');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const loadTasks = async () => {
    try {
      const data = await api.getNearbyTasks();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error('Failed loading tasks', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const data = await api.createTask({
      posterId: user.id,
      title,
      description,
      category: 'Errands',
      budget: Number(budget),
      latitude: -1.2614,
      longitude: 36.8028,
      addressName: 'Nairobi, Kenya'
    });

    if (data.success) {
      setTitle('');
      setDescription('');
      setBudget('');
      loadTasks();
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Toggle */}
      <div className="flex bg-gray-200 p-1 rounded-lg">
        <button
          onClick={() => setActiveRole('POSTER')}
          className={`flex-1 py-2 font-bold rounded-md transition ${activeRole === 'POSTER' ? 'bg-brand text-white' : 'text-gray-700'}`}
        >
          Task Poster
        </button>
        <button
          onClick={() => setActiveRole('TASKER')}
          className={`flex-1 py-2 font-bold rounded-md transition ${activeRole === 'TASKER' ? 'bg-brand text-white' : 'text-gray-700'}`}
        >
          Tasker (Find Work)
        </button>
      </div>

      {/* Task Creation Form */}
      {activeRole === 'POSTER' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-md font-bold text-brand mb-4">Post a New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title (e.g. Pick up groceries)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Budget (KES)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <textarea
              placeholder="Task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full h-20"
              required
            ></textarea>
            <button type="submit" className="bg-brand text-white font-bold py-2 px-6 rounded">
              Publish Task
            </button>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-brand">
          {activeRole === 'POSTER' ? 'Active Tasks Feed' : 'Nearby Available Gigs'}
        </h3>
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded border border-gray-200 flex justify-between items-center shadow-sm">
            <div>
              <h4 className="font-bold">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-brand">KES {task.budget}</p>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}