"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTaskModal from "./AddTaskModal";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const TaskStatus = {
    CREATED: "created",
    OFFER_PENDING: "offer_pending",
    OFFER_ACCEPTED: "offer_accepted",
    OFFER_REJECTED: "offer_rejected",
    IN_PROGRESS: "in_progress",
    COMPLETED_BY_PROVIDER: "completed_by_provider",
    COMPLETION_ACCEPTED: "completion_accepted",
    COMPLETION_REJECTED: "completion_rejected",
    CANCELLED_BY_USER: "cancelled_by_user",
    CANCELLED_BY_PROVIDER: "cancelled_by_provider",
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);


  const fetchTasks = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}tasks/me`;
      const token = localStorage.getItem("token"); // Retrieve the Bearer token from localStorage
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
        params: { status: statusFilter }, // Optional query parameter for filtering by status
      });
      setTasks(response.data); // Update the tasks state with the response data
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}tasks`;
      const token = localStorage.getItem("token");
      await axios.post(apiUrl, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskClick = (taskId) => {
    window.location.href = `/tasks/${taskId}`;
  };

  return (
    <div>
      <h1>User Task Management</h1>

      {/* Filter by Task Status */}
      <div>
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          {Object.entries(TaskStatus).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.taskName}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleTaskClick(task.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>

      {/* Add Task Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTask}
        />
      )}

      <button onClick={() => setShowModal(true)}>Add New Task</button>
    </div>
  );
};

export default TaskPage;
