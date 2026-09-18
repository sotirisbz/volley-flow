import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const signToken = (user) => {
  jwt.sign(
    { sub: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const getUserFromRequest = async (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    return await User.findById(decoded.sub);
  } catch {
    return null;
  }
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      const requester = await getUserFromRequest(req);
      if (!requester) {
        res.status(401);
        throw new Error(
          "An accoun already exists - log in to create another one",
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("That username is already taken"));
    }
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }

    const user = await User.findOne(username);
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid username or password");
    }

    res.json({
      token: signToken(user),
      user: { id: user._id, usernmae: user.username },
    });
  } catch (err) {
    next(err);
  }
};
