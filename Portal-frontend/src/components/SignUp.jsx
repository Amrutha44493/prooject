import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [userform, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  function capValue(e) {
    e.preventDefault();

    // Check for empty fields
    if (
      !userform.name ||
      !userform.email ||
      !userform.password ||
      !userform.phone ||
      !marks
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    // Check for individual field errors
    if (emailError || phoneError || marksError || passwordError) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    axios
      .post("http://localhost:5000/SignUp", userform)
      .then((res) => {
        alert("SignUp successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert("SignUp failed. Please try again.");
      });
  }

  const [email1, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [phone1, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [marks, setMarks] = useState("");
  const [marksError, setMarksError] = useState(false);

  const [password1, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (value) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(!isValid);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    setUserForm({ ...userform, email: e.target.value });
  };

  const validatePhone = (value) => {
    const isValid = /^\d{10}$/.test(value);
    setPhoneError(!isValid);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhone(value);
    setUserForm({ ...userform, phone: e.target.value });
  };

  const validateMarks = (value) => {
    const isValid = /^(100|[1-9]?[0-9])$/.test(value) && parseInt(value) >= 40;
    setMarksError(!isValid);
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    setMarks(value);
    validateMarks(value);
  };

  const validatePassword = (value) => {
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
    setPasswordError(!isValid);
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    setUserForm({ ...userform, password: e.target.value });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: "2rem",
          width: "100%",
          maxWidth: "300px",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            variant="outlined"
            placeholder="Enter your full name"
            fullWidth
            onChange={(e) => {
              setUserForm({ ...userform, name: e.target.value });
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            placeholder="Enter your email address"
            fullWidth
            value={email1}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? "please enter a valid email address." : ""}
          />
          <TextField
            id="outlined-phone-input"
            label="Phone"
            placeholder="Enter your phone number"
            value={phone1}
            onChange={handlePhoneChange}
            error={phoneError}
            helperText={
              phoneError ? "Please enter a valid 10-digit number." : ""
            }
          />
          <TextField
            label="Marks"
            variant="outlined"
            placeholder="Enter your marks out of 100"
            fullWidth
            value={marks}
            onChange={handleMarksChange}
            error={marksError}
            helperText={
              marksError
                ? "Marks must be a number between 0 and 100, and at least 40 to be eligible."
                : ""
            }
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            variant="outlined"
            fullWidth
            value={password1}
            error={passwordError}
            onChange={handlePasswordChange}
            helperText={
              passwordError
                ? "Password must be at least 8 characters long and include uppercase, lowercase, and a number."
                : ""
            }
          />
          <Button
            className="animated-btn"
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "160px", alignSelf: "center" }}
            onClick={capValue}
          >
            Submit
          </Button>
          {/* <Link to={"/admin"}>
            <Typography color="primary">
              Are you an admin? Click here to log in.
            </Typography>
          </Link> */}
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;