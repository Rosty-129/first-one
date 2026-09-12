import jwt from "jsonwebtoken";

const verify = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "no token",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "no token",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
};

export default verify;