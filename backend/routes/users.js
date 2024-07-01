const express = require('express');
const User = require("../models/Users");
const router = express.Router();
const bcrypt = require('bcrypt');
//done
/* Getting user by id */
router.get("/getuser/:id", async (req, res) => {
    try {
        console.log("Fetching user with ID:", req.params.id);
        const user = await User.findById(req.params.id)
            .populate("activeTransactions")
            .populate("prevTransactions");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

/* Getting all members in the library */
router.get("/allmembers", async (req, res) => {
    try {
        const users = await User.find({})
            .populate("activeTransactions")
            .populate("prevTransactions")
            .sort({ _id: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching all members:", err);
        res.status(500).json({ message: "Error fetching all members", error: err.message });
    }
});

/* Update user by id */
router.put("/updateuser/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ message: "Error hashing password", error: err.message });
            }
        }
        try {
            console.log("Updating user with ID:", req.params.id);
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true, runValidators: true });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (err) {
            console.error("Error updating user:", err);
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                const value = err.keyValue[field];
                return res.status(400).json({ message: `Duplicate key error: The ${field} "${value}" already exists.`, error: err.message });
            }
            res.status(500).json({ message: "Error updating user", error: err.message });
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
});

/* Adding transaction to active transactions list */
router.put("/:id/move-to-activetransactions", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const user = await User.findById(req.body.userId);
            await user.updateOne({ $push: { activeTransactions: req.params.id } });
            res.status(200).json("Added to Active Transaction");
        } catch (err) {
            console.error("Error moving to active transactions:", err);
            res.status(500).json({ message: "Error moving to active transactions", error: err.message });
        }
    } else {
        res.status(403).json("Only Admin can add a transaction");
    }
});

/* Adding transaction to previous transactions list and removing from active transactions list */
router.put("/:id/move-to-prevtransactions", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const user = await User.findById(req.body.userId);
            await user.updateOne({ $pull: { activeTransactions: req.params.id } });
            await user.updateOne({ $push: { prevTransactions: req.params.id } });
            res.status(200).json("Added to Prev transaction Transaction");
        } catch (err) {
            console.error("Error moving to previous transactions:", err);
            res.status(500).json({ message: "Error moving to previous transactions", error: err.message });
        }
    } else {
        res.status(403).json("Only Admin can do this");
    }
});

/* Delete user by id */
router.delete("/deleteuser/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({ message: "Error deleting user", error: err.message });
        }
    } else {
        res.status(403).json("You can delete only your account!");
    }
});

module.exports = router;
