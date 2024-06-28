const express = require("express");
const User = require("../models/Users.js");
const bcrypt = require("bcrypt");

const router = express.Router();
//done
/* User Registration */
router.post("/register", async (req, res) => {
  try {

    console.log("Request body:", req.body); // Log the request body for debugging
    const { userType, userFullName, admissionId, employeeId, age, dob, gender, address, mobileNumber, email, password, isAdmin } = req.body;

    // Validate input data
    if (!userType || !userFullName || !email || !password) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { admissionId: admissionId },
        { employeeId: employeeId },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this Admission ID, Employee ID, or Email." });
    }

    // Salting and hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      userType,
      userFullName,
      admissionId,
      employeeId,
      age,
      dob,
      gender,
      address,
      mobileNumber,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false, // Default isAdmin to false if not provided
    });

    // Save user to database
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log("New user saved:", savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: " be Registration failed. Please try again." });
  }
});
/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const { identifier, password } = req.body;

    // Tìm kiếm người dùng dựa trên identifier
    const user = await User.findOne({
      $or: [
        { admissionId: identifier },
        { employeeId: identifier },
        { email: identifier },
        { mobileNumber: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
