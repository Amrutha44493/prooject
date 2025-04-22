const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const studentModel = require("../models/studentData");
const weeklysubmissionModel = require("../models/studentData");