const bcrypt = require("bcrypt");
const db = require("../config/db.js");
const User = db.User;

exports.registerUser = async (req, res) => {
  const {
    firstName,
    secondName,
    lastName,
    secondLastName,
    address,
    phone,
    email,
    username,
    password,
    role,
  } = req.body;

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) {
    return res.status(400).json({ message: "Username already in use" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      secondName,
      lastName,
      secondLastName,
      address,
      phone,
      email,
      username,
      password: hashedPassword,
      role: role || "user", // Default role is 'user' if not provided
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" },
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

exports.findById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

exports.findAllAdminUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "admin" },
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving admin users", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const {
    firstName,
    secondName,
    lastName,
    secondLastName,
    address,
    phone,
    email,
    username,
    password,
    role,
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already in use" });
      }
    }

    const updatedData = {
      firstName,
      secondName,
      lastName,
      secondLastName,
      address,
      phone,
      email,
      username,
      role: role || user.role, // Keep existing role if not provided
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
