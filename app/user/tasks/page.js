"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddTaskModal from "./AddTaskModal";
import { format } from "date-fns";
import OffersModal from "./OffersModal";
import ProgressModal from "./ProgressModal";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openOffersModal, setOpenOffersModal] = useState(false);
  const [openProgressModal, setOpenProgressModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const theme = useTheme();

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
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status: statusFilter === "ALL" ? "" : statusFilter },
      });
      setTasks(response.data);
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

  const formatDate = (isoDate) => format(new Date(isoDate), "yyyy-MM-dd");

  const handleShowOffers = (task) => {
    setSelectedTask(task);
    setOpenOffersModal(true);
  };

  const handleShowProgress = (task) => {
    setSelectedTask(task);
    setOpenProgressModal(true);
  };

  const handleAcceptCompletion = async (taskId) => {
    console.log(`Accept completion for task: ${taskId}`);
    // await axios.patch(...) to accept
    fetchTasks();
  };

  const handleRejectCompletion = async (taskId) => {
    console.log(`Reject completion for task: ${taskId}`);
    // await axios.patch(...) to reject
    fetchTasks();
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        color: "text.primary",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Task Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="ALL">All</MenuItem>
            {Object.entries(TaskStatus).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setShowModal(true)}>
          Add New Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Description</TableCell>

              <TableCell>Category</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Working Hours</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} hover sx={{ cursor: "pointer" }}>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.taskName}
                </TableCell>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.description}
                </TableCell>

                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.category?.name}
                </TableCell>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {formatDate(task.expectedStartDate)}
                </TableCell>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.expectedWorkingHours}
                </TableCell>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.hourlyRate} {task.currency}
                </TableCell>
                <TableCell onClick={() => handleTaskClick(task.id)}>
                  {task.status.replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  {task.status === TaskStatus.OFFER_PENDING && (
                    <Button
                      variant="outlined"
                      onClick={() => handleShowOffers(task)}
                    >
                      Show Offers
                    </Button>
                  )}
                  {task.status === TaskStatus.IN_PROGRESS && (
                    <Button
                      variant="outlined"
                      onClick={() => handleShowProgress(task)}
                    >
                      Show Progress
                    </Button>
                  )}
                  {task.status === TaskStatus.COMPLETED_BY_PROVIDER && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptCompletion(task.id)}
                        sx={{ mr: 1 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRejectCompletion(task.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {task.status === TaskStatus.CREATED && <>Waiting Offer</>}
                  {task.status === TaskStatus.OFFER_ACCEPTED && (
                    <>Offer Accepted</>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTask}
        />
      )}

      <OffersModal
        open={openOffersModal}
        onClose={() => setOpenOffersModal(false)}
        task={selectedTask}
      />

      <ProgressModal
        open={openProgressModal}
        onClose={() => setOpenProgressModal(false)}
        task={selectedTask}
      />
    </Box>
  );
};

export default TaskPage;
