"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Grid,
} from "@mui/material";

const SignUp = () => {
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [formData, setFormData] = useState({});

  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
    setFormData({});
  };

  const handleChange = (e) => {
    if (e.target.name == "providerType") {
      const val = e.target.value === "individual" ? "individual" : "company";
      setFormData({ ...formData, providerType: val });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint =
      role === "user"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signup`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}provider/signup`;
    try {
      const response = await axios.post(apiEndpoint, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      alert(
        response.data.accessToken ? "Sign-up successful!" : "Sign-up failed."
      );

      if (role === "user") {
        router.push("/user/tasks");
      } else {
        router.push("/provider/bid-task");
      }
    } catch (error) {
      alert("Error signing up");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper", // Light background for dark mode
        color: "text.primary", // Text color based on theme
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>

      {/* Tabs for selecting role */}
      <Tabs
        value={role}
        onChange={handleRoleChange}
        centered
        sx={{ marginBottom: 3 }}
      >
        <Tab label="User" value="user" />
        <Tab label="Provider" value="provider" />
      </Tabs>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              onChange={handleChange}
              value={formData.username || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password || ""}
            />
          </Grid>

          {role === "user" ? (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                  value={formData.firstName || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  value={formData.lastName || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  onChange={handleChange}
                  value={formData.mobileNumber || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street No"
                  name="streetNo"
                  onChange={handleChange}
                  value={formData.streetNo || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Name"
                  name="streetName"
                  onChange={handleChange}
                  value={formData.streetName || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  onChange={handleChange}
                  value={formData.city || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  onChange={handleChange}
                  value={formData.state || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Post Code"
                  name="postCode"
                  onChange={handleChange}
                  value={formData.postCode || ""}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Provider Type"
                  name="providerType"
                  onChange={handleChange}
                  value={formData.providerType || "individual"}
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  onChange={handleChange}
                  value={formData.mobileNumber || ""}
                />
              </Grid>
              {formData.providerType === "individual" ? (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName || ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName || ""}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      onChange={handleChange}
                      value={formData.companyName || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      onChange={handleChange}
                      value={formData.phoneNumber || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Tax Number"
                      name="businessTaxNumber"
                      onChange={handleChange}
                      value={formData.businessTaxNumber || ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Representative First Name"
                      name="representativeFirstName"
                      onChange={handleChange}
                      value={formData.representativeFirstName || ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Representative Last Name"
                      name="representativeLastName"
                      onChange={handleChange}
                      value={formData.representativeLastName || ""}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street No"
                  name="streetNo"
                  onChange={handleChange}
                  value={formData.streetNo || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Name"
                  name="streetName"
                  onChange={handleChange}
                  value={formData.streetName || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  onChange={handleChange}
                  value={formData.city || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  onChange={handleChange}
                  value={formData.state || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Post Code"
                  name="postCode"
                  onChange={handleChange}
                  value={formData.postCode || ""}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SignUp;
