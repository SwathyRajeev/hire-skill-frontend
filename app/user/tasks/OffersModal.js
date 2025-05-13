// components/OffersModal.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const OffersModal = ({ open, onClose, task }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [respondingOfferId, setRespondingOfferId] = useState(null);

  useEffect(() => {
    if (task?.id) fetchOffers();
  }, [task]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}tasks/${task.id}/offers`;
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (offerId, accept) => {
    setRespondingOfferId(offerId);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}tasks/offer/respond`;
      const token = localStorage.getItem("token");

      await axios.patch(
        apiUrl,
        { offerId, accept },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOffers(); 
    } catch (error) {
      console.error("Error responding to offer:", error);
    } finally {
      setRespondingOfferId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Offers for: {task?.taskName}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : offers.length === 0 ? (
          <Typography>No offers available.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => {
                const providerName =
                  offer.provider.companyDetails?.companyName ||
                  `${offer.provider.individualDetails?.firstName || ""} ${offer.provider.individualDetails?.lastName || ""}`.trim() ||
                  "Unknown";

                const isActionable = !offer.isAccepted && !offer.isRejected;

                return (
                  <TableRow key={offer.id}>
                    <TableCell>{providerName}</TableCell>
                    <TableCell>{offer.rate}</TableCell>
                    <TableCell>{offer.message}</TableCell>
                    <TableCell>
                      {offer.isAccepted
                        ? "Accepted"
                        : offer.isRejected
                        ? "Rejected"
                        : "Pending"}
                    </TableCell>
                    <TableCell align="center">
                      {isActionable ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={respondingOfferId === offer.id}
                            onClick={() => handleRespond(offer.id, true)}
                            sx={{ mr: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={respondingOfferId === offer.id}
                            onClick={() => handleRespond(offer.id, false)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OffersModal;
