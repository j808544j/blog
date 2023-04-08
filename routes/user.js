const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide a username, email, and password" });
    }

    await isDuplicate(username, email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

async function isDuplicate(email, username) {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    let existingField = existingUser.email === email ? "email" : "username";
    return res
      .status(400)
      .json({ msg: `An account with that ${existingField} already exists` });
  }
}

module.exports = router;
