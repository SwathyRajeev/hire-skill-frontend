"use client";

import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`;
      const response = await axios.post(apiUrl, formData);
      const { accessToken } = response.data;

      // Decode the JWT to extract the role
      const decodedToken = jwtDecode(accessToken);
      const role = decodedToken?.role;

      // Store the token and role in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);

      // Update global auth state
      login(role);
      // Redirect based on role
      if (role === "user") {
        router.push("/user/tasks"); // Redirect to tasks page for users
      } else {
        router.push("/provider/bid-task"); // Redirect to bid task page for providers
      }
      alert("Signed in successfully");
    } catch (error) {
      alert("Error signing in");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper", // Light background for dark mode
        color: "text.primary", // Text color based on theme
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              onChange={handleChange}
              value={formData.username}
              InputLabelProps={{ style: { color: "text.secondary" } }} // Label color
              InputProps={{
                style: { color: "text.primary" }, // Input text color
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              InputLabelProps={{ style: { color: "text.secondary" } }}
              InputProps={{
                style: { color: "text.primary" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SignIn;
