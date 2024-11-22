const express = require("express");
const User = require("../Models/User");
const Tasks = require("../Models/Tasks");
const mongoose = require("mongoose");
const Referral = require("../Models/Referral");

const router = express.Router();

// Route to check if user is signed up
router.post("/check", async (req, res) => {
  try {
    const { username, id, referrer } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res
        .status(200)
        .json({ message: "User exists", signedUp: true, user });
    } else {
      const newUser = new User({
        id:Number(id),
        username,
        spin: 0,
        points: 0,
        referrals: [],
        premium: false,
        referrer,
      });
      await newUser.save();
      const referral = await User.findOne({ id: referrer });
      if (referral) {
        const updatedUser = await User.findOneAndUpdate(
          { id: referrer },
          { $set: { points: referral.points + 750 } }, // Update with the new points
          {
            new: true,
            runValidators: true,
          }
        );
        console.log(updatedUser);
      }

      return res
        .status(200)
        .json({ message: "User not found", signedUp: false, user: newUser });
    }
  } catch (error) {
    console.log(error.message);
  }
});
router.delete("/check", async (req, res) => {
  try {
    const { username, id, referrer } = req.body;
    const user = await User.deleteMany({});

    res.json({ msg: "deleted" });
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id }, // Filter by the username field
      { $set: req.body }, // Update with the request body
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
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
    return res.status(200).json({ user });
  } else {
    return res.status(404).json({ message: "Users not found" });
  }
});
router.get("/check/all/tasks", async (req, res) => {
  try {
    const tasks =await Tasks.find({});
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
router.delete("/check/tasks/delete/:_id", async (req, res) => {
  try {
    const tasks = await Tasks.deleteOne({ _id: req.params._id,username:req.body.username }); // Await the query
     const updatedUser = await User.findOneAndUpdate(
       { id: req.body.id }, // Filter by the username field
       {
         $inc: {
           points: req.body.points,
           spin: req.body.spins,
         },
       }, // Update with the request body
       {
         new: true, // Return the updated document
         runValidators: true, // Run schema validation
       }
     );
     console.log(updatedUser);
    res.status(200).json({tasks, user:updatedUser}); // Send the resolved tasks
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to delete task tasks" });
  }
});
router.post("/check/tasks/sendAll", async (req, res) => {
  const { title, description, category, link, points } = req.body;

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
router.post("/check-referrer", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user?.referrer) {
    return res.json({ hasReferrer: true });
  }
  res.json({ userReferral: user?.referrer });
});

// router.patch("/set-referrer/:id", async (req, res) => {
//   try {
//       const { userId, startParam } = req.body;
//  const user = await User.findOneAndUpdate(
//     req.params._id,
//     { $set: req.body },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.json({ message: "Referrer set successfully",user });
//   } catch (error) {
//     console.log(error);
//   }

// });
router.post("/referrals", async (req, res) => {
  const { referrerId } = req.body;

  try {
    const user = await User.find({ referrer: Number(referrerId) });
    console.log(req.body);
    
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/check/referrals/:username", async (req, res) => {
  try {
    const referrals = await Referral.find({ username: req.params.username });

    if (!referrals) return res.status(404).send("referrals not found");
    await updatedUser.save();
    res.json({ referrals: referrals.referrals });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/check/referral/all", async (req, res) => {
  try {
    const referrer = await Referral.find({});

    if (!referrer) return res.status(404).send("referrer not found");
    res.json({ referrer });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/check/referrer/:username", async (req, res) => {
  try {
    const referrer = await Referral.find({ username: req.params.username });

    if (!referrer) return res.status(404).send("referrer not found");
    await updatedUser.save();
    res.json({ referrer: referrer.referrer });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/check/referrals/sendAll", async (req, res) => {
  try {
    const users = await User.find({});
    const referrals = users.map((user) => ({
      referrer: "23323442345432",
      referrals: ["2355234dd43", "34532485933"],
      username: user.username,
    }));

    // Insert all Referrals at once
    await Referral.insertMany(referrals);
    res.status(201).json(referrals);
  } catch (error) {
    console.log(error.message);
  }
});
router.patch("/check/referrals/:username", async (req, res) => {
  try {
    // Use an object as the filter to find the referral by username
    const updatedReferral = await Referral.findOneAndUpdate(
      { username: req.params.username }, // Filter by the username field
      { $set: req.body }, // Update with the request body
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
      }
    );

    // If no referral was found, return a 404 error
    if (!updatedReferral) return res.status(404).send("Referral not found");

    // Save the updated referral (not necessary if findOneAndUpdate works)
    await updatedReferral.save();

    // Send the updated referral data back in the response
    res.json({ user: updatedReferral });
  } catch (error) {
    // Send error message if something goes wrong
    res.status(400).send(error.message);
  }
});
router.delete("/check/referrals", async (req, res) => {
  try {
    // Use an object as the filter to find the referral by username
    const updatedReferral = await Referral.deleteMany({});

    // If no referral was found, return a 404 error
    if (!updatedReferral) return res.status(404).send("Referral not found");

    // Save the updated referral (not necessary if findOneAndUpdate works)
    // await updatedReferral.de();

    // Send the updated referral data back in the response
    res.json({ msg: "deleted" });
  } catch (error) {
    // Send error message if something goes wrong
    res.status(400).send(error.message);
  }
});
router.delete("/check/referrals/:username", async (req, res) => {
  try {
    // Use an object as the filter to find the referral by username
    const updatedReferral = await User.deleteMany({
      username: req.params.username,
    });

    // If no referral was found, return a 404 error
    if (!updatedReferral) return res.status(404).send("Referral not found");

    // Save the updated referral (not necessary if findOneAndUpdate works)
    // await updatedReferral.de();

    // Send the updated referral data back in the response
    res.json({ msg: "deleted" });
  } catch (error) {
    // Send error message if something goes wrong
    res.status(400).send(error.message);
  }
});

module.exports = router;
