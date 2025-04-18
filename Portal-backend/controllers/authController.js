const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentData');
const { validationResult } = require('express-validator'); 

exports.loginStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if student exists
    let student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

  
      if (password !== student.password) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    const payload = {
      student: {
        id: student.id,
      },
    };

    jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }, 
    (err, token) => {
     if (err) throw err;
     res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLoggedInStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password'); 
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};