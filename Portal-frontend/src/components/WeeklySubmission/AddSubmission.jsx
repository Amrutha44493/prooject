import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/GridLegacy";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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

const AddSubmission = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { width: "100%" }, padding: 4 }}
        noValidate
        autoComplete="off"
      >
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={8} sx={{ mx: "auto" }}>
            <Item>
              <TextField
                id="outlined-multiline-static"
                label="Comment"
                multiline
                rows={4}
                required
                placeholder="Add a comment..."
              />
            </Item>
          </Grid>
          <Grid item xs={6} sx={{ mx: "auto" }}>
            <Item>
              <TextField
                id="outlined-multiline-static"
                label="Link"
                multiline
                rows={3}
                placeholder="Add Link"
              />
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item sx={{ height: 100 }}>
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 1.5 }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.zip"
                />
              </Button>
              {selectedFile && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f5f5f5",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    Selected file: {selectedFile.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    aria-label="remove file"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Item>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          >
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AddSubmission;
