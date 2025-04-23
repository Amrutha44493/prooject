const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/auth');
const projectRoutes = require("./routes/projectRoutes");
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
const basicRoutes = require('./routes/studentRoutes');
app.use("/signup", basicRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/pdf', pdfRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));