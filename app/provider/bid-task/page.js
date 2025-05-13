'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const BidTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rate, setRate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}tasks?status=created`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response1 = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}tasks?status=offer_pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.concat(response1.data));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setRate('');
    setMessage('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  const handleSubmitOffer = async () => {
    if (!rate || !message) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}tasks/offer`,
        {
          taskId: selectedTask.id,
          rate: parseFloat(rate),
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Failed to submit offer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>
        Provider Bid Task Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks available for bidding.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.taskName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {task.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" onClick={() => handleOpenModal(task)}>
                    Make Offer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Make Offer Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Make an Offer</DialogTitle>
        <DialogContent>
          <TextField
            label="Rate"
            type="number"
            fullWidth
            margin="normal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitOffer}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BidTaskPage;
