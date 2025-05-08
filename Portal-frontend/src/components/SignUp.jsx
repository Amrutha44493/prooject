// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import { Typography, Button, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const SignUp = ({onswitchForm}) => {
//   const [userform, setUserForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     mark: "",
//   });

//   const navigate = useNavigate();

//   function capValue(e) {
//     e.preventDefault();

//     // Check for empty fields
//     if (
//       !userform.name ||
//       !userform.email ||
//       !userform.password ||
//       !userform.phone ||
//       !marks
//     ) {
//       alert("Please fill in all the fields.");
//       return;
//     }

//     // Check for individual field errors
//     if (emailError || phoneError || marksError || passwordError) {
//       alert("Please correct the errors in the form before submitting.");
//       return;
//     }

//     axios
//       .post("http://localhost:5000/SignUp", userform)
//       .then((res) => {
//         alert("SignUp successful!");
//         navigate("/login");
//       })
//       .catch((err) => {
//         console.log(err);
//         const errorMsg =
//           err?.response?.data?.message || "SignUp failed. Please try again.";
//         alert(errorMsg);
//       });
//   }

//   const [email1, setEmail] = useState("");
//   const [emailError, setEmailError] = useState(false);

//   const [phone1, setPhone] = useState("");
//   const [phoneError, setPhoneError] = useState(false);

//   const [marks, setMarks] = useState("");
//   const [marksError, setMarksError] = useState(false);

//   const [password1, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState(false);

//   const validateEmail = (value) => {
//     const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//     setEmailError(!isValid);
//   };

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);
//     validateEmail(value);
//     setUserForm({ ...userform, email: e.target.value });
//   };

//   const validatePhone = (value) => {
//     const isValid = /^\d{10}$/.test(value);
//     setPhoneError(!isValid);
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     setPhone(value);
//     validatePhone(value);
//     setUserForm({ ...userform, phone: e.target.value });
//   };

//   const validateMarks = (value) => {
//     const isValid = /^(100|[1-9]?[0-9])$/.test(value) && parseInt(value) >= 40;
//     setMarksError(!isValid);
//   };

//   const handleMarksChange = (e) => {
//     const value = e.target.value;
//     setMarks(value);
//     validateMarks(value);
//     setUserForm({ ...userform, mark: e.target.value });
//   };

//   const validatePassword = (value) => {
//     const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
//     setPasswordError(!isValid);
//   };
//   const handlePasswordChange = (e) => {
//     const value = e.target.value;
//     setPassword(value);
//     validatePassword(value);
//     setUserForm({ ...userform, password: e.target.value });
//   };

//   return (
//     <Box
//       sx={{
//         // height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         // backgroundColor: "#f5f5f5",
//          minHeight: '90vh',
//          marginTop:"4px"
//       }}
//     >
//       <Paper
//         elevation={5}
//         sx={{
//           padding: "2rem",
//           width: "100%",
//           maxWidth: "300px",
//           textAlign: "center",
//           borderRadius: "10px",
//           marginBottom:"3px"
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           Sign Up
//         </Typography>
//         <Box
//           component="form"
//           noValidate
//           autoComplete="off"
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//         >
//           <TextField
//             label="Name"
//             variant="outlined"
//             placeholder="Enter your full name"
//             fullWidth
//             onChange={(e) => {
//               setUserForm({ ...userform, name: e.target.value });
//             }}
//           />
//           <TextField
//             label="Email"
//             variant="outlined"
//             placeholder="Enter your email address"
//             fullWidth
//             value={email1}
//             onChange={handleEmailChange}
//             error={emailError}
//             helperText={emailError ? "please enter a valid email address." : ""}
//           />
//           <TextField
//             id="outlined-phone-input"
//             label="Phone"
//             placeholder="Enter your phone number"
//             value={phone1}
//             onChange={handlePhoneChange}
//             error={phoneError}
//             helperText={
//               phoneError ? "Please enter a valid 10-digit number." : ""
//             }
//           />
//           <TextField
//             label="Marks"
//             variant="outlined"
//             placeholder="Enter your marks out of 100"
//             fullWidth
//             value={marks}
//             onChange={handleMarksChange}
//             error={marksError}
//             helperText={
//               marksError
//                 ? "Marks must be a number between 0 and 100, and at least 40 to be eligible."
//                 : ""
//             }
//           />
//           <TextField
//             label="Password"
//             type="password"
//             placeholder="Create a strong password"
//             variant="outlined"
//             fullWidth
//             value={password1}
//             error={passwordError}
//             onChange={handlePasswordChange}
//             helperText={
//               passwordError
//                 ? "Password must be at least 8 characters long and include uppercase, lowercase, and a number."
//                 : ""
//             }
//           />
//           <Button
//             className="animated-btn"
//             type="submit"
//             variant="contained"
//             color="primary"
//             size="small"
//             sx={{ width: "160px", alignSelf: "center", mt:2}}
//             onClick={capValue}
//           >
//             Submit
//           </Button>
//           <Typography sx={{ mt: 1 }}>
//             <Link
//               to={"/logincontroller"}
//               style={{ color: "grey", textDecoration: "none" }}
//               onClick={(e) => {
//                 e.preventDefault();
//                 onswitchForm();
//               }}
//             >
//               <i>Already have an account? Click here</i>
//             </Link>
//           </Typography>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = ({ onswitchForm }) => {
  const [userform, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    mark: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [marksError, setMarksError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => /^\d{10}$/.test(value);
  const validateMarks = (value) =>
    /^(100|[1-9]?[0-9])$/.test(value) && parseInt(value) >= 40;
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);

  const handleChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));

    switch (field) {
      case "email":
        setEmailError(!validateEmail(value));
        break;
      case "phone":
        setPhoneError(!validatePhone(value));
        break;
      case "mark":
        setMarksError(!validateMarks(value));
        break;
      case "password":
        setPasswordError(!validatePassword(value));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Optional if using form, uncomment if form reloads unexpectedly
    setError("");

    const { name, email, password, phone, mark } = userform;

    if (!name || !email || !password || !phone || !mark) {
      setError("Please fill in all the fields.");
      return;
    }

    if (emailError || phoneError || marksError || passwordError) {
      setError("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/SignUp", userform);
      alert("SignUp successful!"); // blocks the thread until user dismisses
      setTimeout(() => {
        window.location.href = "/logincontroller"; // hard refresh + navigation
      }, 0); // even 0ms timeout waits until after alert is dismissed
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "SignUp failed. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "97vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Sign Up
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={userform.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={userform.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={emailError}
                helperText={
                  emailError ? "Please enter a valid email address." : ""
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Phone"
                variant="outlined"
                value={userform.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={phoneError}
                helperText={
                  phoneError ? "Please enter a valid 10-digit number." : ""
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Marks"
                variant="outlined"
                value={userform.mark}
                onChange={(e) => handleChange("mark", e.target.value)}
                error={marksError}
                helperText={
                  marksError
                    ? "Marks must be 40 or above, and between 0 and 100."
                    : ""
                }
              />
            </Box>
            <Box mb={1}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={userform.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={passwordError}
                helperText={
                  <Box sx={{ minHeight: "20px", wordBreak: "break-word" }}>
                    {passwordError && (
                      <>
                        Password must be 8+ chars, with number,
                        <br />
                        uppercase, & lowercase.
                      </>
                    )}
                  </Box>
                }
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#0099cc",
                "&:hover": { backgroundColor: "#29687d" },
              }}
            >
              Submit
            </Button>
          </form>
          <Typography sx={{ mt: 2 }}>
            <Link
              to={"/logincontroller"}
              style={{ color: "grey", textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                onswitchForm();
              }}
            >
              <i>Already have an account? Click here</i>
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignUp;
