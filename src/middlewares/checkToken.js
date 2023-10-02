import { verifyToken } from "../utils/jwt.js";

const checkToken = async (req, res, next) => {
  try {
    const { user } = verifyToken(req.cookies.token);
    if (user) {
      req.user = user; 
      next();
    } else {
      res.status(401).send({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

export { checkToken };
