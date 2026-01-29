import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied", success: false });
  }
  try {
    token = token.split(" ")[1]; // Remove "Bearer " prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid", success: false });
  }
};
