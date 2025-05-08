import React, { useState } from "react";
import Login from "./Login";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SignUp from "./SignUp";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const LoginController = () => {
  const [showSignup, setShowSignup] = useState(false);

  const handleForm = () => {
    setShowSignup((prev) => !prev);
  };
  

  return (
    <div >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid size={7.5} style={{ display:"flex",justifyContent:"center", backgroundColor:"#faeeeb", }}>
            {/* <img src="/ICT Academy Kerala.png" alt="sample" style={{ display:"flex",justifyContent:"center",width: "95%", height:"85%", pt:3 }} /> */}
            <Box
            component="img"
            src="/ICT Academy Kerala.png"
            alt="ICT Academy Kerala"
            sx={{
              // backgroundColor:"#faece8",
              width: "90%",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
          />
          </Grid>
          <Grid size={4.5} >
          <Item className={showSignup ? "scroll-down-animation" : "scroll-up-animation"}>
            {showSignup ? (
              <SignUp onswitchForm={handleForm} />
            ) : (
              <Login onswitchForm={handleForm} />
            )}
          </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default LoginController;
