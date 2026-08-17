import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import BiddingModal from '../components/BiddingModal';
import MpesaCheckoutModal from '../components/MpesaCheckoutModal';

export default function DashboardScreen({ user }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'BID' | 'PAY' | null

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    // If the logged-in user posted it and task is ready for funding -> Open Pay Modal
    if (task.posterId === user.id) {
      setActiveModal('PAY');
    } else {
      // Otherwise open Bidding Modal for Taskers
      setActiveModal('BID');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Available Tasks</h2>
        <button
          onClick={fetchTasks}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            currentUserId={user.id}
            onSelectTask={handleTaskClick}
          />
        ))}
      </div>

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