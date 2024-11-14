const express = require("express");
const User = require("../Models/User");
const Tasks = require("../Models/Tasks");
const mongoose = require("mongoose");

const router = express.Router();

// Route to check if user is signed up
router.post("/check", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res
        .status(200)
        .json({ message: "User exists", signedUp: true, user });
    } else {
      const newUser = new User({
        username,
        spin: 0,
        points: 0,
        referrals: [],
        premium: false,
      });
      await newUser.save();
      return res
        .status(200)
        .json({ message: "User not found", signedUp: false, user: newUser });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/users/:_id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    await updatedUser.save();
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/check/all", async (req, res) => {
  const user = await User.find({});

  if (user) {
    return res
      .status(200)
      .json({ message: "User exists", signedUp: true, user });
  } else {
    return res.status(404).json({ message: "Users not found" });
  }
});
router.get("/check/all/tasks", async (req, res) => {
  try {
    const tasks = Tasks.find({});
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error.message);
  }
  const user = await User.find({});
});
router.get("/check/tasks/:username", async (req, res) => {
  try {
    const tasks = await Tasks.find({ username: req.params.username }); // Await the query
    res.status(200).json(tasks); // Send the resolved tasks
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});
router.post("/check/tasks/sendAll", async (req, res) => {
    const { title, description, category,link,points } = req.body;

 try {
   const users = await User.find({});
    const tasks = users.map((user) => ({
      title,
      description,
      category: category || "special", // Set default if no category
      completed: false,
      username: user.username,
      points,
      link,
    }));
  
    // Insert all tasks at once
    await Tasks.insertMany(tasks);    
     res.status(201).json(tasks);
   
 } catch (error) {
   console.log(error.message);
 }
});
router.patch("/check/referrals/:username", async (req, res) => {
  try {
    const updatedUser = await User.find(
      req.params.username
      // { $set: req.body },
      // {
      //   new: true,
      //   runValidators: true,
      // }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    await updatedUser.save();
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/check/referrals/:username", async (req, res) => {
  try {
    const updatedUser = await User.find({ username : req.params.username});
    
    if (!updatedUser) return res.status(404).send("User not found");
    await updatedUser.save();
    res.json({referrals:updatedUser.referrals, user: updatedUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
 