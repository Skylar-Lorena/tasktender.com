import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import BiddingModal from '../components/BiddingModal';
import MpesaCheckoutModal from '../components/MpesaCheckoutModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { api } from '../services/api';

export default function DashboardScreen({ user }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'BID' | 'PAY' | 'CREATE' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load tasks via API service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    const userId = user?._id || user?.id;
    if (task.posterId === userId) {
      setActiveModal('PAY');
    } else {
      setActiveModal('BID');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Available Tasks</h2>
          <p className="text-xs text-gray-500">Find work or post an errand to get done</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={() => setActiveModal('CREATE')}
            className="text-xs bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded font-bold transition shadow"
          >
            + Post Task
          </button>
        </div>
      </div>

      {/* Task List / Loading / Empty States */}
      {loading ? (
        <div className="text-center py-10 bg-white rounded border border-gray-200 text-gray-400 text-sm">
          Fetching available errands...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 bg-white rounded border border-gray-200 text-gray-500 text-sm">
          No tasks found. Click <span className="font-bold text-brand">+ Post Task</span> to submit your first errand!
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              currentUserId={user?._id || user?.id}
              onSelectTask={handleTaskClick}
            />
          ))}
        </div>
      )}

      {/* Modal Flows */}
      {activeModal === 'CREATE' && (
  <CreateTaskModal
    user={user}
    onClose={() => setActiveModal(null)}
    onTaskCreated={(newTask) => {
      setActiveModal(null);
      // Prepend the newly created task immediately
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }}
  />
)}

      {activeModal === 'BID' && selectedTask && (
        <BiddingModal
          task={selectedTask}
          user={user}
          onClose={() => setActiveModal(null)}
          onBidSubmitted={() => {
            setActiveModal(null);
            fetchTasks();
          }}
        />
      )}

      {activeModal === 'PAY' && selectedTask && (
        <MpesaCheckoutModal
          task={selectedTask}
          user={user}
          onClose={() => setActiveModal(null)}
          onPaymentSuccess={() => {
            setActiveModal(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}