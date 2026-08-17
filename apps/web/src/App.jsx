import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState('PHONE'); // PHONE | OTP | DASHBOARD
  const [activeRole, setActiveRole] = useState('POSTER');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Task creation form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('Errands');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) setStep('OTP');
      else setError(data.error || 'Failed to send verification code');
    } catch (err) {
      setLoading(false);
      setError('Unable to reach authentication server');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, fullName })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setUser(data.user);
        setStep('DASHBOARD');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setLoading(false);
      setError('Verification failed');
    }
  };

  const fetchNearbyTasks = async () => {
    try {
      // Default query coordinates for Nairobi Westlands area
      const res = await fetch(`${API_BASE}/tasks/nearby?latitude=-1.2614&longitude=36.8028&maxDistanceKm=20`);
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  useEffect(() => {
    if (step === 'DASHBOARD') {
      fetchNearbyTasks();
    }
  }, [step]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posterId: user.id,
          title,
          description,
          category,
          budget: Number(budget),
          latitude: -1.2614,
          longitude: 36.8028,
          addressName: 'Nairobi, Kenya'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setDescription('');
        setBudget('');
        fetchNearbyTasks();
      }
    } catch (err) {
      console.error('Failed to post task', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-brand text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-wider">TASK TENDER</h1>
          <p className="text-xs text-gray-300 tracking-widest">CHEKI. TENDA. CHEQUE IT</p>
        </div>
        {user && (
          <div className="text-sm font-medium">
            {user.fullName} ({user.phoneNumber})
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Phone Entry */}
        {step === 'PHONE' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto mt-12">
            <h2 className="text-lg font-bold text-brand mb-4">Sign In / Register</h2>
            <form onSubmit={handleRequestOtp} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded transition"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'OTP' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto mt-12">
            <h2 className="text-lg font-bold text-brand mb-4">Verify Phone</h2>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                <label className="block text-sm font-semibold mb-1">OTP Code (Use 1234 in dev)</label>
                <input
                  type="text"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded transition"
              >
                {loading ? 'Verifying...' : 'Verify and Enter'}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Dashboard */}
        {step === 'DASHBOARD' && (
          <div>
            {/* Role Switcher */}
            <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveRole('POSTER')}
                className={`flex-1 py-2 font-bold rounded-md transition ${
                  activeRole === 'POSTER' ? 'bg-brand text-white' : 'text-gray-700'
                }`}
              >
                Task Poster
              </button>
              <button
                onClick={() => setActiveRole('TASKER')}
                className={`flex-1 py-2 font-bold rounded-md transition ${
                  activeRole === 'TASKER' ? 'bg-brand text-white' : 'text-gray-700'
                }`}
              >
                Tasker (Find Work)
              </button>
            </div>

            {/* Poster Form */}
            {activeRole === 'POSTER' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h3 className="text-md font-bold text-brand mb-4">Post a New Task</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="Pick up groceries at Sarit"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Budget (KES)</label>
                      <input
                        type="number"
                        placeholder="1500"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-brand"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      placeholder="Specify task requirements..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-brand h-20"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded transition"
                  >
                    Publish Task
                  </button>
                </form>
              </div>
            )}

            {/* Task List Feed */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand">
                {activeRole === 'POSTER' ? 'Available Tasks Feed' : 'Nearby Available Gigs'}
              </h3>
              {tasks.length === 0 ? (
                <div className="p-8 bg-white text-center rounded border border-gray-200 text-gray-500">
                  No tasks found in your area. Post one above to get started!
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs bg-gray-100 text-brand px-2 py-1 rounded font-semibold">
                        {task.category}
                      </span>
                      <h4 className="font-bold text-gray-900 mt-1">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{task.location?.addressName || 'Nairobi'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand">KES {task.budget}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}