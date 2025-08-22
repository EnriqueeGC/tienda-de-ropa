const db = require("../config/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = db.User;

const SECRET_KEY = process.env.SECRET_KEY; // Clave secreta para firmar el token

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const isAdmin = user.role === "admin";

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin },
      SECRET_KEY
    );
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
};
