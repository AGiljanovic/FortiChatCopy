import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";


export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      logger.warn(`Unauthorized: Token Missing - IP: ${req.ip}`);
      return res.status(401).json({ error: "Unauthorized: Token Missing" });
    }

    const authTokenPattern = /^Bearer\s[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;

    if (!authTokenPattern.test(token)) {
      logger.warn(`Invalid Token Format - IP: ${req.ip}`);
      return res.status(401).json({ error: "Invalid Token Format" });
    }

    token = token.split(' ')[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    logger.error(`Token verification error: ${err.message} - IP: ${req.ip}`);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid Token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token Expired" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
