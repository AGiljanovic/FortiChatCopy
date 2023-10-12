import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token Missing" });
    }

    const bearerTokenPattern = /^Bearer\s[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;

    if (!bearerTokenPattern.test(token)) {
      return res.status(401).json({ error: "Invalid Token Format" });
    }

    token = token.split(' ')[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid Token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token Expired" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
