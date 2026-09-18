import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized - no token provided");
    }

    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized - user no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      res.status(401);
      return next(new Error("Not authorized - invalid or expired token"));
    }
    next(err);
  }
};
